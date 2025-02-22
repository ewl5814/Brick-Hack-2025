import requests

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
        print(f"{location_name}: {location_id}, {account_id}, {tenant_id}, {period_name}")

        menu_url = f"https://apiservicelocators.fdmealplanner.com/api/v1/data-locator-webapi/20/meals?menuId=TODO&accountId={account_id}&locationId={location_id}&mealPeriodId={period_id}&tenantId={tenant_id}&monthId=2"
