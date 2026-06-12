import yaml
import os

# 1. Haupt-Konfiguration laden
with open('mkdocs.yml', 'r', encoding='utf-8') as f:
    config = yaml.safe_load(f)

# Extrahiere alle echten Dokumente aus der originalen Navigation
def extract_files(nav_item):
    files = []
    if isinstance(nav_item, dict):
        for value in nav_item.values():
            files.extend(extract_files(value))
    elif isinstance(nav_item, list):
        for item in nav_item:
            files.extend(extract_files(item))
    elif isinstance(nav_item, str) and not nav_item.endswith('index.md') and not nav_item.endswith('toc.md'):
        files.append(nav_item)
    return files

doc_files = extract_files(config.get('nav', []))

# 2. Saubere Hierarchie für den Druck aufbauen (Kurzbeschreibung auf Platz 1)
print_nav = []
appendix_sub_elements = []

for file_path in doc_files:
    base_name = os.path.basename(file_path).replace('.md', '').replace('_', ' ').title()
    
    # Haupt-Navigation befüllen bis anhang.md kommt
    if "anhang.md" not in file_path and not appendix_sub_elements:
        print_nav.append({base_name: file_path})
    # Bei anhang.md den Anhang-Block initialisieren
    elif "anhang.md" in file_path:
        appendix_sub_elements.append({"Übersicht": file_path})
    # Alle folgenden Dateien in den Anhang schachteln
    else:
        print_nav_name = base_name.replace('Obc', '(OBC)').replace('Bms', '(BMS)').replace('Imd', '(IMD)')
        appendix_sub_elements.append({print_nav_name: file_path})

if appendix_sub_elements:
    print_nav.append({"Anhang": appendix_sub_elements})

config['nav'] = print_nav

# 3. Native Plugin-Konfiguration festlegen
if 'plugins' in config:
    config['plugins'] = [
        'search',
        'macros',
        'git-revision-date-localized',
        {'enumerate-headings': {
            'strict': True,
            'increment_level': 1
        }},
        {'print-site': {
            'add_to_navigation': False,
            'add_cover_page': False,
            'add_table_of_contents': False,
            'exclude': ['index.md']
        }}
    ]

# 4. mkdocs.print.yml wegschreiben
with open('mkdocs.print.yml', 'w', encoding='utf-8') as f:
    yaml.dump(config, f, allow_unicode=True, default_flow_style=False)

print("✔ mkdocs.print.yml erfolgreich via generate_print.py generiert!")