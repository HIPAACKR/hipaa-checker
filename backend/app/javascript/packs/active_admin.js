// Load Active Admin's styles into Webpacker,
// see `active_admin.scss` for customization.
import "../stylesheets/active_admin.scss";
import "trix"
import "@rails/actiontext"
import "trix/dist/trix.css"
import "../stylesheets/trix_overrides.scss"
import "@activeadmin/activeadmin";
import 'jquery';
import 'jquery-ui/ui/widgets/dialog';
import 'jquery-ui/themes/base/all.css';

(function () {
    let inited = false;
    function currentSuggestionId() {
        const m = location.pathname.match(/\/admin\/suggestions\/(\d+)\/edit$/);
        return m ? m[1] : null;
    }

    function initSuggestionForm() {
        if (inited) return; // avoid double-binding on Turbo nav
        inited = true;

        const $platforms     = $('#platforms');
        const $ruleSelect    = $('#rule_id_select');
        const $subruleSelect = $('#subrule_id_select');
        const $patterns      = $('#patterns');
        const suggestionId = currentSuggestionId();

        function setOptions($select, values) {
            $select.empty();
            (values || []).forEach(v => $select.append(new Option(v, v, false, false)));
        }
        function renderPatternCheckboxes(values, selected = []) {
            console.log("Selected: ", selected);
            $patterns.empty();
            $patterns.append('<div class="pattern-group"><p><strong>Patterns:\n</strong></p></div>');
            const box = $patterns.find('.pattern-group')[0];

            (values || []).forEach(v => {
                const id = `pattern_${String(v).replace(/\W+/g, '_')}`;

                const label = document.createElement('label');
                label.className = 'pattern-item';
                label.htmlFor = id;

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = id;
                input.name = 'suggestion[patterns][]';
                input.value = v;                // no manual escaping needed
                input.checked = selected.includes(v);

                const span = document.createElement('span');
                span.textContent = v;           // renders literally

                label.append(input, span);
                box.appendChild(label);
            });
        }




        // Platform -> Rules
        $platforms.on('change.sugg', function () {
            const platform = $(this).val();
            if (!platform) { setOptions($ruleSelect, []); setOptions($subruleSelect, []); $patterns.empty(); return; }

            fetch('/admin/suggestions/update_rules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                },
                body: JSON.stringify({ platform, suggestion_id: suggestionId })


            })
                .then(r => r.json())
                .then(({ rules = [], selected = null }) => {
                    setOptions($ruleSelect, rules);
                    setOptions($subruleSelect, []);
                    $patterns.empty();
                    if (selected) $ruleSelect.val(selected);
                    $ruleSelect.trigger('change.sugg');
                })

                .catch(err => console.error('Failed to fetch rules:', err));
        });

        // Rule -> Subrules
        $ruleSelect.on('change.sugg', function () {
            const rule_id  = $(this).val();
            const platform = $platforms.val();
            if (!rule_id || !platform) return;

            fetch('/admin/suggestions/update_subrule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                },
                body: JSON.stringify({ rule_id, platform, suggestion_id: suggestionId })

            })
                .then(r => r.json())
                .then(({ subrules = [], selected = null }) => {
                    setOptions($subruleSelect, subrules);
                    $patterns.empty();
                    if (selected) $subruleSelect.val(selected);
                    $subruleSelect.trigger('change.sugg');
                })

                .catch(err => console.error('Failed to fetch subrules:', err));
        });

        // Subrule -> Patterns
        $subruleSelect.on('change.sugg', function () {
            const subrule_id = $(this).val();
            const rule_id    = $ruleSelect.val();
            const platform   = $platforms.val();
            if (!subrule_id || !rule_id || !platform) return;

            fetch('/admin/suggestions/update_patterns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                },
                body: JSON.stringify({ rule_id, platform, subrule_id, suggestion_id: suggestionId })

            })
                .then(r => r.json())
                .then(({ patterns = [], selected = [] }) => {
                    renderPatternCheckboxes(patterns, selected);
                })

                .catch(err => console.error('Failed to fetch patterns:', err));
        });

        // 🔹 Kick off the cascade on first load if platform already has a value
        const initialPlatform = $platforms.val();
        if (initialPlatform) {
            $platforms.trigger('change');
        }
    }

    // Support classic ready + Turbo/Turbolinks + ActiveAdmin
    document.addEventListener('DOMContentLoaded', initSuggestionForm);
    document.addEventListener('turbo:load', initSuggestionForm);
    $(document).on('turbolinks:load active_admin:loaded', initSuggestionForm);
})();
