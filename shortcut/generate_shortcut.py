#!/usr/bin/env python3
"""Generate the LogFullNutrition.shortcut plist.

Builds the unsigned shortcut file with every action from docs/SHORTCUT_SETUP.md:
parse the URL-scheme JSON payload, log all 39 HealthKit nutrition samples, and
show a confirmation notification. The optional webhook step is intentionally
omitted (it needs a per-user URL and secret); add it in the Shortcuts app per
the docs.

Sign the output on macOS before distributing:
    shortcuts sign --mode anyone \
        --input LogFullNutrition-unsigned.shortcut \
        --output LogFullNutrition.shortcut
"""

import plistlib
import uuid
from pathlib import Path

# (json key path, HealthKit sample type label in Shortcuts, unit)
FIELDS = [
    ("energy_hydration.dietary_energy_kcal", "Dietary Energy", "kcal"),
    ("energy_hydration.water_ml", "Water", "mL"),
    ("energy_hydration.caffeine_mg", "Caffeine", "mg"),
    ("macronutrients.carbohydrates_g", "Carbohydrates", "g"),
    ("macronutrients.dietary_sugar_g", "Dietary Sugar", "g"),
    ("macronutrients.fiber_g", "Fiber", "g"),
    ("macronutrients.protein_g", "Protein", "g"),
    ("macronutrients.total_fat_g", "Total Fat", "g"),
    ("macronutrients.saturated_fat_g", "Saturated Fat", "g"),
    ("macronutrients.monounsaturated_fat_g", "Monounsaturated Fat", "g"),
    ("macronutrients.polyunsaturated_fat_g", "Polyunsaturated Fat", "g"),
    ("macronutrients.cholesterol_mg", "Dietary Cholesterol", "mg"),
    ("vitamins.vitamin_a_mcg", "Vitamin A", "mcg"),
    ("vitamins.thiamin_b1_mg", "Thiamin", "mg"),
    ("vitamins.riboflavin_b2_mg", "Riboflavin", "mg"),
    ("vitamins.niacin_b3_mg", "Niacin", "mg"),
    ("vitamins.pantothenic_acid_b5_mg", "Pantothenic Acid", "mg"),
    ("vitamins.vitamin_b6_mg", "Vitamin B6", "mg"),
    ("vitamins.biotin_b7_mcg", "Biotin", "mcg"),
    ("vitamins.folate_b9_mcg", "Folate", "mcg"),
    ("vitamins.cobalamin_b12_mcg", "Vitamin B12", "mcg"),
    ("vitamins.vitamin_c_mg", "Vitamin C", "mg"),
    ("vitamins.vitamin_d_iu", "Vitamin D", "IU"),
    ("vitamins.vitamin_e_mg", "Vitamin E", "mg"),
    ("vitamins.vitamin_k_mcg", "Vitamin K", "mcg"),
    ("minerals.calcium_mg", "Calcium", "mg"),
    ("minerals.chloride_mg", "Chloride", "mg"),
    ("minerals.chromium_mcg", "Chromium", "mcg"),
    ("minerals.copper_mg", "Copper", "mg"),
    ("minerals.iodine_mcg", "Iodine", "mcg"),
    ("minerals.iron_mg", "Iron", "mg"),
    ("minerals.magnesium_mg", "Magnesium", "mg"),
    ("minerals.manganese_mg", "Manganese", "mg"),
    ("minerals.molybdenum_mcg", "Molybdenum", "mcg"),
    ("minerals.phosphorus_mg", "Phosphorus", "mg"),
    ("minerals.potassium_mg", "Potassium", "mg"),
    ("minerals.selenium_mcg", "Selenium", "mcg"),
    ("minerals.sodium_mg", "Sodium", "mg"),
    ("minerals.zinc_mg", "Zinc", "mg"),
]


def action(identifier: str, params: dict) -> dict:
    return {
        "WFWorkflowActionIdentifier": identifier,
        "WFWorkflowActionParameters": params,
    }


def output_ref(action_uuid: str, output_name: str) -> dict:
    """Magic-variable reference to a previous action's output."""
    return {
        "Value": {
            "Type": "ActionOutput",
            "OutputUUID": action_uuid,
            "OutputName": output_name,
        },
        "WFSerializationType": "WFTextTokenAttachment",
    }


def token_string(action_uuid: str, output_name: str) -> dict:
    """Interpolated-string form of a magic variable (single token).

    Numeric fields like WFQuantityFieldValue's Magnitude expect this
    WFTextTokenString shape when they hold a variable instead of a literal.
    """
    return {
        "Value": {
            "string": "￼",
            "attachmentsByRange": {
                "{0, 1}": {
                    "Type": "ActionOutput",
                    "OutputUUID": action_uuid,
                    "OutputName": output_name,
                }
            },
        },
        "WFSerializationType": "WFTextTokenString",
    }


def build() -> dict:
    actions = []

    # 1. Get Dictionary from Shortcut Input
    payload_uuid = str(uuid.uuid4()).upper()
    actions.append(
        action(
            "is.workflow.actions.detect.dictionary",
            {
                "UUID": payload_uuid,
                "CustomOutputName": "Payload",
                "WFInput": {
                    "Value": {"Type": "ExtensionInput"},
                    "WFSerializationType": "WFTextTokenAttachment",
                },
            },
        )
    )

    # 2. Per field: Get Dictionary Value (key path) -> Log Health Sample
    for key_path, sample_type, unit in FIELDS:
        value_uuid = str(uuid.uuid4()).upper()
        actions.append(
            action(
                "is.workflow.actions.getvalueforkey",
                {
                    "UUID": value_uuid,
                    "CustomOutputName": sample_type,
                    "WFDictionaryKey": key_path,
                    "WFInput": output_ref(payload_uuid, "Payload"),
                },
            )
        )
        actions.append(
            action(
                "is.workflow.actions.health.quantity.log",
                {
                    "UUID": str(uuid.uuid4()).upper(),
                    "WFQuantitySampleType": sample_type,
                    "WFQuantitySampleQuantity": {
                        "Value": {
                            "Magnitude": token_string(value_uuid, sample_type),
                            "Unit": unit,
                        },
                        "WFSerializationType": "WFQuantityFieldValue",
                    },
                    "WFQuantitySampleAdditionalQuantity": {
                        "Value": {"Unit": unit},
                        "WFSerializationType": "WFQuantityFieldValue",
                    },
                },
            )
        )

    # 3. Confirmation notification
    meal_name_uuid = str(uuid.uuid4()).upper()
    actions.append(
        action(
            "is.workflow.actions.getvalueforkey",
            {
                "UUID": meal_name_uuid,
                "CustomOutputName": "Meal Name",
                "WFDictionaryKey": "meal_name",
                "WFInput": output_ref(payload_uuid, "Payload"),
            },
        )
    )
    actions.append(
        action(
            "is.workflow.actions.notification",
            {
                "WFNotificationActionTitle": "OpenNutriSync",
                "WFNotificationActionBody": {
                    "Value": {
                        "string": "Logged ￼ to Health",
                        "attachmentsByRange": {
                            "{7, 1}": {
                                "Type": "ActionOutput",
                                "OutputUUID": meal_name_uuid,
                                "OutputName": "Meal Name",
                            }
                        },
                    },
                    "WFSerializationType": "WFTextTokenString",
                },
            },
        )
    )

    return {
        "WFWorkflowMinimumClientVersion": 900,
        "WFWorkflowMinimumClientVersionString": "900",
        "WFWorkflowClientVersion": "2607.1.3",
        "WFWorkflowIcon": {
            "WFWorkflowIconStartColor": 4292093695,
            "WFWorkflowIconGlyphNumber": 61440,
        },
        "WFWorkflowImportQuestions": [],
        "WFWorkflowInputContentItemClasses": [
            "WFStringContentItem",
            "WFURLContentItem",
        ],
        "WFWorkflowTypes": [],
        "WFWorkflowHasOutputFallback": False,
        "WFWorkflowHasShortcutInputVariables": True,
        "WFWorkflowActions": actions,
    }


if __name__ == "__main__":
    out = Path(__file__).parent / "LogFullNutrition-unsigned.shortcut"
    workflow = build()
    # XML, not binary: binary plist object-uniquing shares identical sub-dicts
    # across actions, which Apple's own exports never do.
    with open(out, "wb") as f:
        plistlib.dump(workflow, f, fmt=plistlib.FMT_XML)
    print(f"wrote {out} ({out.stat().st_size} bytes, {len(workflow['WFWorkflowActions'])} actions)")
