import requests
import csv

def scrape():
    data_format = ["allergenName", "carbohydrates", "dietaryFiber", "fat", "protein", "saturatedFat", "vitaminA", "calories", "transFattyAcid", "calcium", "cholesterol", "iron", "sodium", "vitaminC", "totalSugars"]
    data = [["name", "location", "period"] + data_format[1:]]

    locations_url = "https://locations.fdmealplanner.com/api/v1/location-data-webapi/search-locationByAccount?AccountShortName=RIT&isActive=1&IsPlannerLocation=1&pageIndex=1&pageSize=0&isWeb=1"
    locations_response = requests.get(locations_url).json()
    for location in locations_response["data"]["result"]:
        location_id = location["locationId"]
        account_id = location["accountId"]
        tenant_id = location["tenantId"]
        location_name = location["locationName"]

        periods_url = f"https://apiservicelocators.fdmealplanner.com/api/v1/data-locator-webapi/20/mealPeriods?IsActive=1&LocationId={location_id}"
        periods_response = requests.get(periods_url).json()
        for period in periods_response["data"]:
            period_id = period["id"]
            period_name = period["mealPeriodName"]

            print(f"{location_name}: {location_id}, {account_id}, {tenant_id}, ({period_id}, {period_name})")

            menu_url = f"https://apiservicelocators.fdmealplanner.com/api/v1/data-locator-webapi/20/meals?accountId={account_id}&locationId={location_id}&mealPeriodId={period_id}&tenantId={tenant_id}&monthId=2"
            menu_response = requests.get(menu_url).json()
            for section in menu_response["result"]:
                if section["allMenuRecipes"] is not None:
                    for item in section["allMenuRecipes"]:
                        if item["englishAlternateName"] is not None:
                            item_data = [item["englishAlternateName"], location_name, period_name]
                        else:
                            item_data = [item["componentName"].replace(";", "-"), location_name, period_name]
                        for info in data_format:
                            item_data.append(item[info])
                        data.append(item_data)

    with open('data.csv', 'w', newline='') as data_csv:
        writer = csv.writer(data_csv)
        writer.writerows(data)

if __name__ == "__main__":
    scrape()
