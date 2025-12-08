import { SearchBar } from "react-native-elements";
import { Movie } from "../types";
import { sampleData } from "../sampleData";

const SearchBarComponent = ({
  searchValue,
  setData,
  setSearchValue,
}: {
  searchValue: string;
  setData: (data: Movie[]) => void;
  setSearchValue: (text: string) => void;
}) => {
  // Function to handle search functionality
  const searchFunction = (text?: string): void => {
    text = text || "";
    const updatedData = sampleData.filter((item) => {
      const itemData = item.title.toUpperCase(); // Convert item title to uppercase
      const textData = text.toUpperCase(); // Convert search text to uppercase
      return itemData.includes(textData); // Check if item title includes the search text
    });
    setData(updatedData); // Update the filtered data
    setSearchValue(text); // Update the search value
  };

  return (
    <SearchBar
      placeholder="Search Here..." // Placeholder text for the search bar
      value={searchValue} // Bind the search value to the state
      onChangeText={searchFunction} // Call searchFunction on text change
      lightTheme // Use light theme for the search bar
      round // Make the search bar round
      autoCorrect={false} // Disable auto-correct
      platform="default" // Use default platform style
      containerStyle={{
        backgroundColor: "white", // Background color of the container
        borderTopWidth: 0, // Remove top border
        borderBottomWidth: 0, // Remove bottom border
        padding: 5, // Padding around the container
        borderColor: "black", // Border color
      }}
      inputContainerStyle={{
        backgroundColor: "lightgrey", // Background color of the input container
        borderRadius: 10, // Rounded corners for the input container
        padding: 5, // Padding inside the input container
      }}
      inputStyle={{
        backgroundColor: "white", // Background color of the input field
        borderRadius: 10, // Rounded corners for the input field
        padding: 5, // Padding inside the input field
      }}
      cancelIcon={{ size: 24, color: "black" }} // Style for the cancel icon
      showLoading={false}
      cancelButtonTitle={""}
      showCancel={false}
      onFocus={() => {}}
      clearIcon={() => {}}
      searchIcon={{ name: "" }}
      loadingProps={{}}
      onClear={() => {}}
      onCancel={() => {}}
      cancelButtonProps={{}}
      onBlur={() => {}} //TODO: why are these necessary?, seems so annoying!!!
      style={{}}
    />
  );
};

export { SearchBarComponent };
