
import cage from "../commands/cage.js";
import caged from "../commands/caged.js";
import collar from "../commands/collar.js";
import domprofile from "../commands/domprofile.js";
import subprofile from "../commands/subprofile.js";
import jail from "../commands/jail.js";
import bratjail from "../commands/bratjail.js";
import red from "../commands/red.js";
import release from "../commands/release.js";
import star from "../commands/star.js";
import starchart from "../commands/starchart.js";
import task from "../commands/task.js";
import taskcomplete from "../commands/taskcomplete.js";
import worship from "../commands/worship.js";
import punish from "../commands/punish.js";
import setup from "../commands/setup.js";

export function loadAll() {
  return [cage, caged, collar, domprofile, subprofile, jail, bratjail, red, release, star, starchart, task, taskcomplete, worship, punish, setup];
}

export function loadCommandsForRegistration() {
  return loadAll().map(c => c.data.toJSON());
}
