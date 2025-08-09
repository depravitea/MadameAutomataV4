
from .cage import setup as cage_setup
from .caged import setup as caged_setup
from .collar import setup as collar_setup
from .domprofile import setup as domprofile_setup
from .subprofile import setup as subprofile_setup
from .jail import setup as jail_setup
from .bratjail import setup as bratjail_setup
from .red import setup as red_setup
from .release import setup as release_setup
from .star import setup as star_setup
from .starchart import setup as starchart_setup
from .starreview import setup as starreview_setup
from .task import setup as task_setup
from .taskcomplete import setup as taskcomplete_setup
from .worship import setup as worship_setup
from .punish import setup as punish_setup
from .setupcfg import setup as setupcfg_setup

def register_all(bot):
    for s in [cage_setup, caged_setup, collar_setup, domprofile_setup, subprofile_setup,
              jail_setup, bratjail_setup, red_setup, release_setup, star_setup,
              starchart_setup, task_setup, taskcomplete_setup, worship_setup, punish_setup,
              setupcfg_setup]:
        s(bot)

from ._monitor import setup as monitor_setup

def register_all(bot):
    for s in [cage_setup, caged_setup, collar_setup, domprofile_setup, subprofile_setup,
                  jail_setup, bratjail_setup, red_setup, release_setup, star_setup,
                  starchart_setup, task_setup, taskcomplete_setup, worship_setup, punish_setup,
                  setupcfg_setup, monitor_setup]:
            s(bot)