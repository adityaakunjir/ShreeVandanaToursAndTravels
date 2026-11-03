"""All adaptive variants are built together from the canonical source plan."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name('encode-adaptive-cinema.py')),run_name='__main__')
