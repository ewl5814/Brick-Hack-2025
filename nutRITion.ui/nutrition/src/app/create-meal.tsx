import LocationSelect from "./location-select";

export default function CreateMealView() {
    return(
        <div className="text-center">
            <h1 className="text-2xl font-bold">Create a Meal</h1>
            <LocationSelect />
        </div>
    )
}
