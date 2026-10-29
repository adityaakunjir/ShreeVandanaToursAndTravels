"""Compatibility entry point for destination montage tooling."""
import runpy
from pathlib import Path

runpy.run_path(str(Path(__file__).with_name('encode-destination-montages.py')), run_name='__main__')
