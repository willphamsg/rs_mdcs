"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
// component-store
const avoid_combining_component_store_selectors_1 = __importDefault(require("./component-store/avoid-combining-component-store-selectors"));
const avoid_mapping_component_store_selectors_1 = __importDefault(require("./component-store/avoid-mapping-component-store-selectors"));
const updater_explicit_return_type_1 = __importDefault(require("./component-store/updater-explicit-return-type"));
const require_super_ondestroy_1 = __importDefault(require("./component-store/require-super-ondestroy"));
// effects
const avoid_cyclic_effects_1 = __importDefault(require("./effects/avoid-cyclic-effects"));
const no_dispatch_in_effects_1 = __importDefault(require("./effects/no-dispatch-in-effects"));
const no_effects_in_providers_1 = __importDefault(require("./effects/no-effects-in-providers"));
const no_multiple_actions_in_effects_1 = __importDefault(require("./effects/no-multiple-actions-in-effects"));
const prefer_action_creator_in_of_type_1 = __importDefault(require("./effects/prefer-action-creator-in-of-type"));
const prefer_effect_callback_in_block_statement_1 = __importDefault(require("./effects/prefer-effect-callback-in-block-statement"));
const use_effects_lifecycle_interface_1 = __importDefault(require("./effects/use-effects-lifecycle-interface"));
// store
const avoid_combining_selectors_1 = __importDefault(require("./store/avoid-combining-selectors"));
const avoid_dispatching_multiple_actions_sequentially_1 = __importDefault(require("./store/avoid-dispatching-multiple-actions-sequentially"));
const avoid_duplicate_actions_in_reducer_1 = __importDefault(require("./store/avoid-duplicate-actions-in-reducer"));
const avoid_mapping_selectors_1 = __importDefault(require("./store/avoid-mapping-selectors"));
const good_action_hygiene_1 = __importDefault(require("./store/good-action-hygiene"));
const no_multiple_global_stores_1 = __importDefault(require("./store/no-multiple-global-stores"));
const no_reducer_in_key_names_1 = __importDefault(require("./store/no-reducer-in-key-names"));
const no_store_subscription_1 = __importDefault(require("./store/no-store-subscription"));
const no_typed_global_store_1 = __importDefault(require("./store/no-typed-global-store"));
const on_function_explicit_return_type_1 = __importDefault(require("./store/on-function-explicit-return-type"));
const prefer_action_creator_1 = __importDefault(require("./store/prefer-action-creator"));
const prefer_action_creator_in_dispatch_1 = __importDefault(require("./store/prefer-action-creator-in-dispatch"));
const prefer_inline_action_props_1 = __importDefault(require("./store/prefer-inline-action-props"));
const prefer_one_generic_in_create_for_feature_selector_1 = __importDefault(require("./store/prefer-one-generic-in-create-for-feature-selector"));
const prefer_selector_in_select_1 = __importDefault(require("./store/prefer-selector-in-select"));
const prefix_selectors_with_select_1 = __importDefault(require("./store/prefix-selectors-with-select"));
const select_style_1 = __importDefault(require("./store/select-style"));
const use_consistent_global_store_name_1 = __importDefault(require("./store/use-consistent-global-store-name"));
// operators
const prefer_concat_latest_from_1 = __importDefault(require("./operators/prefer-concat-latest-from"));
// signals
const signal_state_no_arrays_at_root_level_1 = __importDefault(require("./signals/signal-state-no-arrays-at-root-level"));
const signal_store_feature_should_use_generic_type_1 = __importDefault(require("./signals/signal-store-feature-should-use-generic-type"));
const with_state_no_arrays_at_root_level_1 = __importDefault(require("./signals/with-state-no-arrays-at-root-level"));
const prefer_protected_state_1 = __importDefault(require("./signals/prefer-protected-state"));
const enforce_type_call_1 = __importDefault(require("./signals/enforce-type-call"));
exports.rules = {
    // component-store
    'avoid-combining-component-store-selectors': avoid_combining_component_store_selectors_1.default,
    'avoid-mapping-component-store-selectors': avoid_mapping_component_store_selectors_1.default,
    'updater-explicit-return-type': updater_explicit_return_type_1.default,
    'require-super-ondestroy': require_super_ondestroy_1.default,
    //effects
    'avoid-cyclic-effects': avoid_cyclic_effects_1.default,
    'no-dispatch-in-effects': no_dispatch_in_effects_1.default,
    'no-effects-in-providers': no_effects_in_providers_1.default,
    'no-multiple-actions-in-effects': no_multiple_actions_in_effects_1.default,
    'prefer-action-creator-in-of-type': prefer_action_creator_in_of_type_1.default,
    'prefer-effect-callback-in-block-statement': prefer_effect_callback_in_block_statement_1.default,
    'use-effects-lifecycle-interface': use_effects_lifecycle_interface_1.default,
    // store
    'avoid-combining-selectors': avoid_combining_selectors_1.default,
    'avoid-dispatching-multiple-actions-sequentially': avoid_dispatching_multiple_actions_sequentially_1.default,
    'avoid-duplicate-actions-in-reducer': avoid_duplicate_actions_in_reducer_1.default,
    'avoid-mapping-selectors': avoid_mapping_selectors_1.default,
    'good-action-hygiene': good_action_hygiene_1.default,
    'no-multiple-global-stores': no_multiple_global_stores_1.default,
    'no-reducer-in-key-names': no_reducer_in_key_names_1.default,
    'no-store-subscription': no_store_subscription_1.default,
    'no-typed-global-store': no_typed_global_store_1.default,
    'on-function-explicit-return-type': on_function_explicit_return_type_1.default,
    'prefer-action-creator': prefer_action_creator_1.default,
    'prefer-action-creator-in-dispatch': prefer_action_creator_in_dispatch_1.default,
    'prefer-inline-action-props': prefer_inline_action_props_1.default,
    'prefer-one-generic-in-create-for-feature-selector': prefer_one_generic_in_create_for_feature_selector_1.default,
    'prefer-selector-in-select': prefer_selector_in_select_1.default,
    'prefix-selectors-with-select': prefix_selectors_with_select_1.default,
    'select-style': select_style_1.default,
    'use-consistent-global-store-name': use_consistent_global_store_name_1.default,
    // operators
    'prefer-concat-latest-from': prefer_concat_latest_from_1.default,
    // signals
    'signal-state-no-arrays-at-root-level': signal_state_no_arrays_at_root_level_1.default,
    'signal-store-feature-should-use-generic-type': signal_store_feature_should_use_generic_type_1.default,
    'prefer-protected-state': prefer_protected_state_1.default,
    'with-state-no-arrays-at-root-level': with_state_no_arrays_at_root_level_1.default,
    'enforce-type-call': enforce_type_call_1.default,
};
//# sourceMappingURL=index.js.map