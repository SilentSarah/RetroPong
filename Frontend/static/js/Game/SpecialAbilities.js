export class SpecialAbilities {
    constructor() {
        this.railshot = {
            ready: true,
            active: false,
        }
        this.guard = {
            ready: true,
            active: false,
        }
        this.speedup = {
            ready: true,
            active: false,
        }
    }
    activate_special_ability(ability, side) {
        if (ability === "railshot") {
            if (this.railshot.ready) {
                this.railshot.active = true;
                this.railshot.ready = false;
            }
        } else if (ability === "guard") {
            if (this.guard.ready) {
                this.guard.active = true;
                this.guard.ready = false;
            }
        } else if (ability === "speedup") {
            if (this.speedup.ready) {
                this.speedup.active = true;
                this.speedup.ready = false;
            }
        }
        if (ability === "guard" || ability === "speedup")
            setTimeout(() => this.disable_special_ability(ability), 7000);

        if (side === "left") {
            const sa = document.getElementById(`${ability}`);
            sa.classList.add("opacity-50");
        } else if (side === "right") {
            const sa = document.getElementById(`${ability}2`);
            sa.classList.add("opacity-50");
        }
    }
    reset_all_special_abilities() {
        this.railshot = {
            ready: true,
            active: false,
        }
        this.guard = {
            ready: true,
            active: false,
        }
        this.speedup = {
            ready: true,
            active: false,
        }
        const player_1_sa = document.getElementById("player_1_sa");
        const player_2_sa = document.getElementById("player_2_sa");

        for (const child of player_1_sa.children)
            child.classList.remove("opacity-50");
        for (const child of player_2_sa.children)
            child.classList.remove("opacity-50");
    }
    disable_special_ability(ability) {
        if (ability === "railshot") {
            this.railshot.active = false;
        } else if (ability === "guard") {
            this.guard.active = false;
        } else if (ability === "speedup") {
            this.speedup.active = false;
        }
    }
    check_special_ability(ability) {
        if (ability === "railshot") {
            return this.railshot.active;
        } else if (ability === "guard") {
            return this.guard.active;
        } else if (ability === "speedup") {
            return this.speedup.active;
        }
    }
}