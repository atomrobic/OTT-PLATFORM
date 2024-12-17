import re

def extract_youtube_video_id(url):
    """
    Extracts the YouTube video ID from a given URL.
    """
    youtube_regex = (
        r'(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/v/)([\w-]{11})'
    )
    match = re.match(youtube_regex, url)
    if match:
        return match.group(1)
    return None
