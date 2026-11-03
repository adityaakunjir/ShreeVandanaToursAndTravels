"""Compatibility entry point for the current adaptive film audit."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name('audit-premium-films.py')), run_name='__main__')
