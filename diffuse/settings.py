# Django settings for glide project.
import os.path
import django.conf.global_settings as DEFAULT_SETTINGS

PROJECT_DIR = os.path.dirname(__file__)

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'db',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Europe/London'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-gb'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = os.path.join(PROJECT_DIR, "../media")

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/media/'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/static/admin/'

STATIC_ROOT = os.path.join(PROJECT_DIR, "../static")

STATIC_URL = "/static/"

STATICFILES_DIRS = ( os.path.join(PROJECT_DIR, "../static"), )

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'h^hsvu&@y2s!548-mk%fhyr(g^$a_zpthmyi-d)e)4ebwo=ua4'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

ROOT_URLCONF = 'diffuse.urls'

STATIC_DOC_ROOT = os.path.join(PROJECT_DIR, "static")

TEMPLATE_DIRS = (
    os.path.join(PROJECT_DIR, "../templates"),
)


INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.staticfiles',
    'debug_toolbar',
    'tinymce',
    'south',
    'annoying',
    'polymorphic',
    'diffuse.motes',
)

TEMPLATE_CONTEXT_PROCESSORS = DEFAULT_SETTINGS.TEMPLATE_CONTEXT_PROCESSORS+(
        "django.core.context_processors.request",
        "motes.context_processors.user_plans",
    )

def custom_show_toolbar(request):
    return True

DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False,
    'SHOW_TOOLBAR_CALLBACK': custom_show_toolbar,
}

LOGIN_REDIRECT_URL = "/plans/"
LOGIN_URL = "/login/"

ENABLED_MOTE_TYPES = [
    {
        'identifier': 'qa',
        'app': 'mote_qa',
        'mote_type': 'Question',},
    {
        'identifier': 'slide',
        'app': 'mote_slide',
        'mote_type': 'Slide',},
    {
        'identifier': 'association',
        'app': 'mote_associate',
        'mote_type': 'AssociationGroup',},
]

for mote_type in ENABLED_MOTE_TYPES:
    print mote_type
    INSTALLED_APPS = INSTALLED_APPS + (mote_type['app'],)
    TEMPLATE_DIRS = TEMPLATE_DIRS + (os.path.join(PROJECT_DIR, '/', mote_type['app'], '/templates'),)

TINYMCE_JS_URL = STATIC_URL + 'js/tiny_mce/tiny_mce.js'
TINYMCE_JS_ROOT = STATIC_ROOT + 'js/tiny_mce'
