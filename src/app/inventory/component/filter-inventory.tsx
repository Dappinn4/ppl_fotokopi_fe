import { InventoryList } from './inventory-list';

// Define the InventoryList interface
interface InventoryList {
    inventory_id: number;
    item_name: string;
    quantity: number
    unit_price: number
    last_updated: string;
}

// New search function to encapsulate the logic
export const filterInventory = (
    inventoryData: InventoryList[],
    query: string
): InventoryList[] => {
    {/* Filter the inventory data based on the search query */}
    const lowercasedQuery = query.toLowerCase();
    return inventoryData.filter((item) => {
        {/* Check if the item ID, name, or category includes the search query */}
        return (
            item.inventory_id.toString().includes(lowercasedQuery) ||
            item.item_name.toLowerCase().includes(lowercasedQuery)
        );
    });
};
