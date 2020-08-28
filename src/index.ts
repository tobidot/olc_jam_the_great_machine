import { load_menu } from "./menu/app";
import { load_game } from "./game/main";

(() => {
    load_game();
    load_menu();
})();