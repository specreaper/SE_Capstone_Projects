import time
import board  # type: ignore
import os
import wifi # type: ignore
import socketpool # type: ignore
import adafruit_ntp # type: ignore
import terminalio# type: ignore
import rtc # type: ignore
import random # type: ignore
import digitalio # type: ignore
from adafruit_matrixportal.matrixportal import MatrixPortal # type: ignore

matrixportal = MatrixPortal(status_neopixel=board.NEOPIXEL, debug=False)
matrixportal.graphics.display.rotation = 180

# Color definitions (RGB)
COLORS = {
    "green": (0, 255, 0),
    "yellow": (255, 255, 0),
    "blue": (0, 0, 255),
    "white": (255, 255, 255),
}

def setup_display():
    """Initialize display elements"""
    # Scrolling message (top)
    matrixportal.add_text(
        text_font=terminalio.FONT,
        text_position=(0, 10),
        text_color=COLORS["green"],
        scrolling=True,
    )

def main():
    setup_display()
    matrixportal.set_text("hello", 0)

if __name__ == "__main__":
    main()