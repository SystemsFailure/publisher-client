import { generateRandomId } from "@/utils"
import { ref } from "vue"

function createDefaultRow() {
    return {
        "Площадка": "Авито",
        Id: generateRandomId(10),
        Category: "Квартиры",
        Description: "Описание объекта...",
        Address: "Краснодар, ул Красная, дом 115",
        OperationType: "Сдам",
        Price: "15000",
        RoomType: "Изолированные",
        Renovation: "Косметический",
        PropertyRights: "Собственник",
        LeaseType: "На длительный срок",
        HouseType: "Кирпичный",
        Floor: "1",
        Floors: "10",
        Rooms: "Студия",
        Square: "36",
        LeaseDeposit: "1 месяц",
        LeaseCommissionSize: "0",
        KitchenSpace: "12",
        UtilityMeters: "Оплачивается арендатором",
        OtherUtilities: "Оплачивается арендатором",
        OtherUtilitiesPayment: "0",
        SmokingAllowed: "Да",
        ChildrenAllowed: "Да",
        PetsAllowed: "Да",
        ContactPhone: "7 | 9530731420",
        RoomArea: "0",
        LeaseAppliances: {
            AirConditioning: false,
            Refrigerator: false,
            Stove: false,
            Microwave: false,
            WashingMachine: false,
            Dishwasher: false,
            WaterHeater: false,
            TV: false,
            Iron: false,
            Hairdryer: false,
        },
        Furniture: {
            Kitchen: false,
            Cabinets: false,
            Beds: false,
        },
        LeaseMultimedia: {
            Wifi: false,
        },
        LeaseComfort: {
            Fireplace: false,
            BalconyLoggia: false,
            Parking: false,
        },
        ParkingAdditionally: {
            Free: false,
            ForTrucks: false,
        },
        BathroomMulti: {
            Combined: false,
            Separate: false,
        },
        Parking: {
            Underground: false,
            GroundLevelMultilevel: false,
            OpenYard: false,
            BehindBarrierYard: false,
        },
        BuiltYear: 2010,
        Documents: "Да",
    }
}

export function useDefaultRow() {
    const defaultRow = ref(createDefaultRow())

    function updateDefaultRow() {
        defaultRow.value = createDefaultRow();
    }

    return {
        defaultRow,
        updateDefaultRow,
    }
}