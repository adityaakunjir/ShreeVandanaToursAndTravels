"""Compatibility entrypoint: never maintain a separate shortened shot list."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name('encode-adaptive-cinema.py')),run_name='__main__')
