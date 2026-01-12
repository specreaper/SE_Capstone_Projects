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

# Setup button input up
btn_up = digitalio.DigitalInOut(board.BUTTON_UP)
btn_up.direction = digitalio.Direction.INPUT
btn_up.pull = digitalio.Pull.UP  # enable internal pull-up

# Setup button input down
btn_down = digitalio.DigitalInOut(board.BUTTON_DOWN)
btn_down.direction = digitalio.Direction.INPUT
btn_down.pull = digitalio.Pull.UP  # enable internal pull-up

# Initialize MatrixPortal
matrixportal = MatrixPortal(status_neopixel=board.NEOPIXEL, debug=False)
matrixportal.graphics.display.rotation = 180
# Matrix configuration
MATRIX_WIDTH = 64
MATRIX_HEIGHT = 32
SCROLL_DELAY = 0
message_index = 0
color_index = 0
timer_end = None  # when the timer should end

#Sets up the bell schedule
bell_times = []
class_start_times = []
daytype = 1
MESSAGES = []

# This is for getting and changing the schedule
def set_schedule():
    global bell_times
    global class_start_times
    global daytype
    global MESSAGES
    MESSAGES = ["ict.gctaa.net"]
    # checks for if the button is pressed
    # if it is changes daytype
    if not btn_up.value: 
        daytype += 1
        if daytype > 3:
            daytype = 1
    
    #Checks if daytype is a Regular Bell Schedule
    if daytype == 1:
        bell_times =        ["8:00", "9:24", "9:29", "9:59", "10:04", "11:27", "11:32" 
                            , "12:55", "13:35", "13:40", "15:00"]
        class_start_times = ["8:00",         "9:29",         "10:04",          "11:32" 
                                             , "13:40"]
        if not btn_up.value:
            MESSAGES = ["Regular Bell Schedule"]

    #Checks if daytype is a Early Release Schedule
    if daytype == 2:
        bell_times =        ["8:00", "9:05", "9:10", "10:15", "10:20", "11:25", "11:30"
                            , "12:05", "12:50"]
        class_start_times = ["8:00",         "9:10",          "10:20",          "11:30"
                            , "12:05"]
        if not btn_up.value:
            MESSAGES = ["Early Release Schedule"] 

    #Checks if daytype is a 2-Hour Delay Schedule
    if daytype == 3:
        bell_times =        ["10:00", "11:00", "11:05", "11:35", "11:40", "12:30", "12:35"
                            , "13:30", "13:35", "14:10", "15:00"]
        class_start_times = ["10:00",          "11:05",          "11:40",          "12:35"
                                              , "14:10"]
        if not btn_up.value:
            MESSAGES = ["2-Hour Delay Schedule"] 
    
    #Add this part for BTSN
    bell_times+=["18:00", "18:15", "18:20", "18:30", "18:35", "18:45", "18:50"
             ,"19:00", "19:05", "19:15", "19:20", "19:30", "19:35", "19:45"
             ,"19:50", "20:00"]


def manage_timer_time():
    global timer_end
    TIMER_DURATION = 5 * 60  # Length of timer
    #if you're pressing down and no timer is set
    if not btn_down.value and timer_end == None:
        # Start or restart the timer
        timer_end = time.monotonic() + TIMER_DURATION
    #elsif you're pressing down and there's already a timer
    # Down adding time 
    elif not btn_down.value:
        timer_end += TIMER_DURATION
    #elseif you're pressing UP and there's already a timer
    # Up adding time
    elif not btn_up.value and timer_end > 0:
        timer_end -= TIMER_DURATION


def is_first_5_mins():
    now = time.localtime()
    if now.tm_hour == 0:
        sync_ntp_time()

    # Get current time in minutes since midnight
    current_minutes = now.tm_hour * 60 + now.tm_min
    current_seconds = current_minutes * 60 + now.tm_sec

    # Convert bell times to minutes since midnight
    bell_minutes = []
    for bell in class_start_times:
        hour, minute = map(int, bell.split(":"))
        bell_minutes.append(hour * 60 + minute)

    # Find the most recent bell time
    last_bell_min = None
    for bell_min in bell_minutes:
        if bell_min * 60 <= current_seconds:  # Compare in seconds
            last_bell_min = bell_min
        else:
            break

    # 5 mins, minus the amount of time we've been in class
    try:
        time_diff_seconds = (5 * 60) - (current_seconds - (last_bell_min * 60))
    except:
        time_diff_seconds = 0

    if time_diff_seconds > 0:
        return time_diff_seconds
    else:
        return -1


def connect_wifi():
    """Connect to WiFi using settings.toml credentials"""
    print("Connecting to WiFi...")
    isConnected = False
    while not isConnected:
        try:
            wifi.radio.connect(
                os.getenv("CIRCUITPY_WIFI_SSID"), os.getenv("CIRCUITPY_WIFI_PASSWORD")
            )
            isConnected = True
        except:
            wifi.radio.connect(
                os.getenv("HOME_WIFI_SSID"), os.getenv("HOME_WIFI_PASSWORD")
            )
            isConnected = True
    print("Connected to WiFi!")
    print("IP:", wifi.radio.ipv4_address)

def sync_ntp_time():
    """Sync time using NTP server directly"""
    try:
        pool = socketpool.SocketPool(wifi.radio)
        ntp = adafruit_ntp.NTP(pool, tz_offset=get_timezone_offset())

        # Update board's RTC
        rtc.RTC().datetime = ntp.datetime
        print("Time synced successfully via NTP!")
    except Exception as e:
        print("Failed to sync time:", e)

def get_timezone_offset():
    """Calculate timezone offset in hours"""
    tz = os.getenv("TIMEZONE", "UTC")
    if "New_York" in tz:
        return -5  # EDT
    return 0  # Default to UTC

def get_current_datetime():
    """Return formatted date and time strings"""
    now = time.localtime()
    date_str = f"{now.tm_mon}/{now.tm_mday}/{now.tm_year % 100}"
    hour = now.tm_hour % 12 or 12  # Convert 0 to 12
    am_pm = "AM" if now.tm_hour < 12 else "PM"
    time_str = f"{hour}:{now.tm_min:02d} {am_pm}"
    return date_str, time_str


def time_remaining():
    now = time.localtime()
    if now.tm_hour == 0:
        sync_ntp_time()

    # Get current time in minutes since midnight
    current_minutes = now.tm_hour * 60 + now.tm_min
    current_seconds = current_minutes * 60 + now.tm_sec

    # Convert bell times to minutes since midnight
    bell_minutes = []
    for bell in bell_times:
        hour, minute = map(int, bell.split(":"))
        bell_minutes.append(hour * 60 + minute)

    # Find the next bell time
    next_bell_minutes = None
    for bell_min in bell_minutes:
        if bell_min * 60 > current_seconds:  # Compare in seconds
            next_bell_minutes = bell_min
            break

    # If no future bell times found
    if next_bell_minutes is None:
        return "School's out for the day!"

    # Calculate time difference in seconds
    time_diff_seconds = (next_bell_minutes * 60) - current_seconds

    # If class just ended or is about to end
    if time_diff_seconds <= 0:
        return "Bell NOW"

    # Convert to minutes and seconds
    minutes = time_diff_seconds // 60
    seconds = str(time_diff_seconds % 60)
    if len(seconds) < 2:
        seconds = "0" + seconds

    # Format the output string
    if minutes > 0:
        return f"Bell:{minutes}:{seconds}"
    else:
        return f"{seconds} sec"


def scroll_speed_update():
    SCROLL_DURATION = 5.0
    label = matrixportal.graphics.text[0]
    text_width = label.bounding_box[2]  # width in pixels
    disp_width = matrixportal.graphics.display.width
    SCROLL_DELAY = SCROLL_DURATION / (text_width + disp_width)


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
        text_position=(2, 10),
        text_color=COLORS["green"],
        scrolling=True,
    )

    # Static info line (bottom)
    matrixportal.add_text(
        text_font=terminalio.FONT,
        # text_position=((matrixportal.graphics.display.width // 6), 24),
        text_position=(0, 24),
        text_color=COLORS["yellow"],
        scrolling=False,
    )

    # Static top line used ONLY for the timer
    matrixportal.add_text(
        text_font=terminalio.FONT,
        text_position=(2, 10),        # SAME position as index 0
        text_color=COLORS["green"],
        scrolling=False,
    )


def main():
    #Calling global variables
    global message_index
    global color_index
    global timer_end

    #Time Related Stuff
    time_index = 0
    last_timer_update = 0
     
    # Initial setup
    connect_wifi()
    sync_ntp_time()
    setup_display()

    # Main loop
    while True:
        set_schedule()
        manage_timer_time()
        # If there is time in the timer show it
        if timer_end is not None:
            now = time.monotonic()
            if now - last_timer_update >= 1:
                last_timer_update = now
                remaining = int(timer_end - now)

                if remaining <= 0:
                    matrixportal.set_text("Timer Done!", 0)
                    matrixportal.set_text("          ", 1) # clear bottom line
                    matrixportal.set_text("          ", 2) # clear top line
                    timer_end = None  # stop timer
                    scroll_speed_update()
                    matrixportal.scroll_text(SCROLL_DELAY)
                else:
                    minutes = remaining // 60
                    seconds = remaining % 60

                    matrixportal.set_text("Time Left: ", 2)
                    matrixportal.set_text(f"  {minutes:02d}:{seconds:02d}", 1)
            time.sleep(1)
        else:
            first_5_mins = is_first_5_mins()
            if first_5_mins != -1:
                matrixportal.set_text("Reading Quiz In:", 0)
                matrixportal.set_text(" " + str(first_5_mins) + " secs", 1)
                scroll_speed_update()
                matrixportal.scroll_text(SCROLL_DELAY)
            else:
                # Update scrolling message
                message = MESSAGES[message_index]
                print(message)
                matrixportal.set_text(message, 0)
                message_index = (message_index + 1) % len(MESSAGES)

                matrixportal.set_text_color(random.choice(list(COLORS.values())))

                # Update info line
                # date_str, time_str = get_current_datetime()
                # weather_str = get_weather()
                # info_text = f"{date_str} | {time_str} | {weather_str}"
                # info_text = f"{time_str}"
                # matrixportal.set_text(info_text, 1)
                if time_index == 0:
                    matrixportal.set_text(time_remaining(), 1)
                else:
                    matrixportal.set_text("  " + get_current_datetime()[1], 1)

                time_index = (time_index + 1) % 2


                # Scroll delay
                scroll_speed_update()
                matrixportal.scroll_text(SCROLL_DELAY)

    print("done")

if __name__ == "__main__":
    main()