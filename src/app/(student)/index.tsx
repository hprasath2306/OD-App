import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ActivityIndicator, Button, RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/src/providers/AuthProvider";
import axios from "axios";
import { fetchForms } from "@/src/api/fetchForms";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Home() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["25%", "40%", "55%", "80%"];
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [category, setCategory] = useState("category1");
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");

  const [forms, setForms] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId: string = user?.user.id;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

  const generateDateArray = (start: Date, end: Date) => {
    const dateArray = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
    }
    return dateArray;
  };

  const loadForms = async () => {
    try {
      if (!userId) return;
      const fetchedForms = await fetchForms(userId);
      setForms(fetchedForms);
      setLoading(false);
    } catch (err) {
      setError("Failed to load forms");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const FORM_TYPE = "ON_DUTY";
    const dateArray = generateDateArray(startDate, endDate);
    // console.log(dateArray);
    const payload = {
      reason,
      requesterId: user.user.id,
      category,
      formType: FORM_TYPE,
      dates: dateArray,
    };
    setReason("");
    setStartDate(new Date());
    setEndDate(new Date());
    setCategory("category1");
    if (count == 1) return alert("You already have a pending request");
    try {
      setLoading(true);
      const response = await axios.post(
        "https://od-automation.onrender.com/trpc/user.student.form.create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      // console.log("Response:", response.data);
      await loadForms();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleStartDateChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    // Check if a date was selected
    if (selectedDate) {
      setStartDate(selectedDate); // Set the new selected date
    }
    setShowStartDatePicker(false); // Hide the picker after selection
  };

  const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
    // Check if a date was selected
    if (selectedDate) {
      setEndDate(selectedDate); // Set the new selected date
    }
    setShowEndDatePicker(false); // Hide the picker after selection
  };

  const openContactModal = () => {
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
  };

  const closeContactModal = () => {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
  };

  useEffect(() => {
    loadForms();
    const intervalId = setInterval(loadForms, 20000);
    return () => clearInterval(intervalId);
  }, [userId]);

  if (loading) {
    return <ActivityIndicator animating={true} color="#7AADFE" size="small" />;
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <BottomSheetModalProvider>
          {
            // Filter the forms for only pending ones
            forms.filter((item) => {
              const lastRequest =
                item.requests.length > 0
                  ? item.requests[item.requests.length - 1]
                  : null;
              return lastRequest?.status === "PENDING"; // Keep only pending forms
            }).length === 0 ? (
              // If no pending forms, display this message
              <Text style={styles.noPendingText}>No Pending ODs</Text>
            ) : (
              // Render the FlatList if there are pending forms
              <FlatList
                data={forms.reverse().filter((item) => {
                  const lastRequest =
                    item.requests.length > 0
                      ? item.requests[item.requests.length - 1]
                      : null;
                  return lastRequest?.status === "PENDING";
                })}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const lastRequest =
                    item.requests.length > 0
                      ? item.requests[item.requests.length - 1]
                      : null;
                  const statusColor =
                    lastRequest?.status === "ACCEPTED"
                      ? "green"
                      : lastRequest?.status === "PENDING"
                      ? "#f8dc75"
                      : "red";
                  const statusText = lastRequest
                    ? lastRequest.status === "ACCEPTED"
                      ? "Accepted"
                      : lastRequest.status === "PENDING"
                      ? "Pending"
                      : "Rejected"
                    : "No Status Available";

                  return (
                    <View style={styles.formItem}>
                      <View style={styles.formHeader}>
                        <Text
                          style={[styles.statusText, { color: statusColor }]}
                        >
                          {statusText}
                        </Text>
                      </View>
                      <Text style={styles.formText}>Reason: {item.reason}</Text>
                      <Text style={styles.formText}>
                        Category: {item.category}
                      </Text>
                      <Text style={styles.formText}>
                        Date: {formatDate(item.createdAt)}
                      </Text>
                      <Text style={styles.formText}>
                        Requested Dates:{" "}
                        {item.dates
                          .map((date: string) => formatDate(date))
                          .join(", ")}
                      </Text>
                    </View>
                  );
                }}
              />
            )
          }

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={openContactModal}
          >
            <AntDesign name="plus" size={26} color="white" />
          </TouchableOpacity>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={2}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 20 }}
          >
            <BottomSheetScrollView>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Add OD
                </Text>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    width: 20,
                    height: 20,
                    right: 20,
                    backgroundColor: "#7AADFE",
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={closeContactModal}
                >
                  <AntDesign name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <View>
                <TextInput
                  placeholder="Reason"
                  value={reason}
                  onChangeText={setReason}
                  style={{
                    borderWidth: 0.5,
                    borderColor: "#333",
                    padding: 10,
                    margin: 16,
                    borderRadius: 5,
                  }}
                />

                <Button
                  onPress={() => setShowStartDatePicker(true)}
                  mode="outlined"
                  style={styles.dateButton}
                >
                  Start Date: {startDate.toLocaleDateString()}
                </Button>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                    minimumDate={new Date()}
                  />
                )}

                <Button
                  onPress={() => setShowEndDatePicker(true)}
                  mode="outlined"
                  style={styles.dateButton}
                >
                  EndDate: {endDate.toLocaleDateString()}
                </Button>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                    minimumDate={startDate}
                  />
                )}
                <RadioButton.Group
                  onValueChange={(newValue) => setCategory(newValue)}
                  value={category}
                >
                  <View style={styles.radioButtonContainer}>
                    <RadioButton value="Symposium" />
                    <Text>Symposium</Text>
                    {/* </View>
                <View style={styles.radioButtonContainer}> */}
                    <RadioButton value="Workshop" />
                    <Text>Workshop</Text>
                    {/* </View>
                <View style={styles.radioButtonContainer}> */}
                    <RadioButton value="Placement" />
                    <Text>Placement</Text>
                  </View>
                </RadioButton.Group>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text>Submit</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EAEFF1",
  },
  message: {
    fontSize: 24, // Larger font size for better readability
    fontWeight: "bold", // Bold text for emphasis
    color: "#333", // Darker color for the text
    textAlign: "center", // Center align text
  },
  floatingButton: {
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 20, // Distance from the bottom of the screen
    right: 20, // Distance from the right side of the screen
    backgroundColor: "#7AADFE", // Background color of the button
    borderRadius: 25, // Rounded corners
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow blur for iOS
    justifyContent: "center", // Center align the content
    alignItems: "center", // Center align the content
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  categoryLabel: {
    marginVertical: 16,
    fontSize: 16,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 5,
    marginLeft: 16,
  },
  submitButton: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 5,
    padding: 16,
    backgroundColor: "#7AADFE",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  formItem: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  formText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 2,
  },
  noPendingText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});
