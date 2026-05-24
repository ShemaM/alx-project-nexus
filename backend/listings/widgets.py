"""
Custom form widgets for the BYN-K admin.

Designed for non-technical staff who shouldn't need to know JSON syntax.
These widgets replace raw JSON text areas with friendly checkbox / repeater UIs.
"""

import json
from django import forms
from django.utils.html import format_html, mark_safe


class DocumentCheckboxWidget(forms.Widget):
    """
    A checkbox group widget for the required_documents JSONField.

    Renders each document type as a labelled checkbox so admin users can
    simply tick the IDs an opportunity accepts — no JSON knowledge needed.
    """

    DOCUMENT_LABELS = [
        ('alien_card',        '🪪 Alien Card'),
        ('ctd',               '📘 CTD (Convention Travel Document)'),
        ('passport',          '🛂 Passport'),
        ('waiting_slip',      '📄 Waiting Slip'),
        ('national_id',       '🪪 National ID'),
        ('work_permit',       '📋 Work Permit'),
        ('birth_certificate', '📜 Birth Certificate'),
        ('any_id',            '✅ Any Valid ID'),
        ('not_specified',     '❓ Not Specified'),
    ]

    def value_from_datadict(self, data, files, name):
        """Read checked values back from the POST data and return JSON."""
        selected = data.getlist(name)
        return json.dumps(selected)

    def render(self, name, value, attrs=None, renderer=None):
        # Decode current value (may be a JSON string or already a list)
        if isinstance(value, str):
            try:
                selected = json.loads(value) if value else []
            except (json.JSONDecodeError, ValueError):
                selected = []
        elif isinstance(value, list):
            selected = value
        else:
            selected = []

        html_parts = [
            '<div style="display:flex;flex-wrap:wrap;gap:10px 24px;padding:12px 0;">',
        ]

        for code, label in self.DOCUMENT_LABELS:
            checked = 'checked' if code in selected else ''
            html_parts.append(
                f'<label style="display:flex;align-items:center;gap:8px;font-size:14px;'
                f'font-weight:500;cursor:pointer;user-select:none;">'
                f'<input type="checkbox" name="{name}" value="{code}" {checked} '
                f'style="width:16px;height:16px;accent-color:#2D8FDD;cursor:pointer;">'
                f'{label}'
                f'</label>'
            )

        html_parts.append('</div>')
        html_parts.append(
            '<p style="margin:4px 0 0;font-size:12px;color:#64748b;">'
            'Tick every document type this opportunity accepts. '
            'Powers the "Filter by your document" feature on the homepage.'
            '</p>'
        )

        return mark_safe(''.join(html_parts))


class PrepChecklistWidget(forms.Widget):
    """
    A friendly repeater widget for the prep_checklist JSONField.

    Renders a table of text inputs (item + required toggle) so staff can
    list application requirements without writing JSON by hand.
    """

    MAX_ROWS = 10

    def value_from_datadict(self, data, files, name):
        """Reconstruct the JSON list from individual row inputs."""
        items = []
        for i in range(self.MAX_ROWS):
            item_text = (data.get(f'{name}_item_{i}') or '').strip()
            if item_text:
                required = data.get(f'{name}_required_{i}') == 'on'
                items.append({'item': item_text, 'required': required})
        return json.dumps(items)

    def render(self, name, value, attrs=None, renderer=None):
        # Decode current value
        if isinstance(value, str):
            try:
                rows = json.loads(value) if value else []
            except (json.JSONDecodeError, ValueError):
                rows = []
        elif isinstance(value, list):
            rows = value
        else:
            rows = []

        html_parts = [
            '<table style="border-collapse:collapse;width:100%;max-width:600px;margin-top:8px;">',
            '<thead><tr>',
            '<th style="text-align:left;padding:6px 12px;font-size:12px;color:#64748b;font-weight:600;">DOCUMENT / ITEM</th>',
            '<th style="text-align:center;padding:6px 8px;font-size:12px;color:#64748b;font-weight:600;width:80px;">REQUIRED?</th>',
            '</tr></thead>',
            '<tbody>',
        ]

        # Ensure we always show at least 5 rows
        display_rows = max(self.MAX_ROWS, len(rows) + 3)
        display_rows = min(display_rows, self.MAX_ROWS)

        for i in range(display_rows):
            row = rows[i] if i < len(rows) else {}
            item_val = row.get('item', '')
            required_val = 'checked' if row.get('required') else ''
            bg = '#f8fafc' if i % 2 == 0 else '#ffffff'

            html_parts.append(
                f'<tr style="background:{bg};">'
                f'<td style="padding:6px 8px;">'
                f'<input type="text" name="{name}_item_{i}" value="{item_val}" '
                f'placeholder="e.g. Updated CV / Resume" '
                f'style="width:100%;padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;'
                f'font-size:13px;outline:none;" /></td>'
                f'<td style="text-align:center;padding:6px 8px;">'
                f'<input type="checkbox" name="{name}_required_{i}" {required_val} '
                f'style="width:16px;height:16px;accent-color:#2D8FDD;cursor:pointer;" />'
                f'</td></tr>'
            )

        html_parts += [
            '</tbody></table>',
            '<p style="margin:6px 0 0;font-size:12px;color:#64748b;">'
            'Add up to 10 items. Leave rows blank to skip them. '
            'Tick "Required?" for must-have documents/items.'
            '</p>',
        ]

        return mark_safe(''.join(html_parts))
