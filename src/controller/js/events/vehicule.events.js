import { UI } from "../ui/UI.js";
import { Utils } from "../utils.js";

export function initVehiculeEvent(user) {
    const { carButton, editCar, addCar, deleteCar,
        submitEditCar, listvoit, closeVoit, closeEdit } = UI.el

    carButton.addEventListener("click", async (e) => {
        handleCar(e);
        UI.toggleVoiture(true);
    })

    editCar.addEventListener("click", async (e) => {
        handleCarEdit(e);
        UI.toggleVoitureEdit(true);
    })

    addCar.addEventListener("click", async (e) => {
        handleCarEdit(e);
        UI.toggleVoitureEdit(true);
    })

    deleteCar.addEventListener("click", async (e) => {
        handleDeleteCar(e);
    })

    submitEditCar.addEventListener("click", async (e) => {
        await handleCarEditSubmit(e);
    })

    listvoit.addEventListener("change", (e) => {
        deleteCar.disabled = listvoit.value === "none";
        editCar.disabled = listvoit.value === "none";
    });

    closeVoit.addEventListener("click", async () => {
        UI.toggleVoiture(false);
    })

    closeEdit.addEventListener("click", async () => {
        UI.toggleVoitureEdit(false);
    })

    async function update() {
        const { settingsButton } = UI.el
        const e = new Event("click");
        try {
            settingsButton.dispatchEvent(e);
            carButton.dispatchEvent(e);
        } catch (e) {
            console.error("Erreur : ", e);
        }

    }

    async function handleCar(event) {
        event.preventDefault();
        UI.resetCarEditList();

        listvoit.value = "none";

        let data = await user.load(user.userId);
        if (!data) alert("Une erreur est survenu !");
        else {
            if (data.vehicules) {
                data.vehicules.forEach(veh => {
                    listvoit.add(new Option(`${veh.plate}`, JSON.stringify(veh)));
                });
            }
        }
    }

    async function handleCarEdit(event) {
        event.preventDefault()
        const { plateParam, vHeightParam, vMotorParam, vTypeParam, editTitle } = UI.el;
        let b = event.target.value
        if (b == "new") {
            listvoit.value = "none"
            editTitle.textContent = "NOUVEAU"
            plateParam.value = "";
            vHeightParam.value = "";
        } else {
            try {
                let data = JSON.parse(listvoit.value)
                editTitle.textContent = "MODIFICATION"
                plateParam.value = data.plate;
                vHeightParam.value = data.height;
                vMotorParam.value = data.motor;
                vTypeParam.value = data.type;
            } catch (e) {
                console.error("Erreur : ", e)
                alert("Une erreur est survenue")
            }
        }

    }

    async function handleCarEditSubmit(event) {
        const { plateParam, vHeightParam, vMotorParam, vTypeParam, errorV } = UI.el;
        const { isEmpty, isValidPlate, isValidPositiveNumber } = Utils

        let id;
        let errors = [];
        if (listvoit.value === "none" || listvoit.value === "") id = user.userId;
        else id = JSON.parse(listvoit.value).id;

        errorV.textContent = "";
        UI.hide(errorV);

        if (isEmpty(plateParam.value))
            errors.push("La plaque est obligatoire");
        else if (!isValidPlate(plateParam.value))
            errors.push("Format de plaque incorrect");
        if (isEmpty(vHeightParam.value))
            errors.push("La hauteur du véhicule est obligatoire");
        else if (!isValidPositiveNumber(vHeightParam.value))
            errors.push("La hauteur du véhicule doit être un nombre entier positif non nul");
        if (isEmpty(vMotorParam.value))
            errors.push("Le type du moteur est obligatoire");
        if (isEmpty(vTypeParam.value))
            errors.push("Le type du véhicule est obligatoire");


        if (errors.length > 0) {
            errorV.textContent = errors.join("\n");
            UI.show(errorV);
            return;
        }
        errorV.textContent = "";

        const info = {
            id: id,
            plate: plateParam.value,
            height: vHeightParam.value,
            type: vTypeParam.value,
            motor: vMotorParam.value
        }
        let resp; let msg = ""
        if (listvoit.value === "none" || listvoit.value === "") {
            resp = await user.createCar(info);
            msg = "Voiture créé avec succès"
        } else {
            resp = await user.updateCar(info);
            msg = "Voiture mise à jour avec succès"
        }

        if (resp.status && resp.status === "success") {
            await update();
            UI.notify("Voitures", msg)
            UI.toggleVoitureEdit(false);
        } else if (resp.message) {
            errorV.textContent = resp.message
            UI.show(errorV);
        }

    }

    async function handleDeleteCar(event) {
        event.preventDefault();

        if (listvoit.value === "none" || listvoit === "") return;

        const id = JSON.parse(listvoit.value).id;
        if (confirm("Voulez vraiment supprimer ce véhicule")) {
            let res = await user.deleteCar(id);
            if (res.status != "success" && res.message) {
                console.log(res.message)
                alert(res.message)
            } else {
                UI.notify("Véhicule", "Véhicule supprimé avec succès !")
                await update();
            }
        }
    }

}