import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "@/src/providers/AuthProvider";
import { fetchTeacherForms, acceptOrReject } from "@/src/api/fetchForms"; // Assume fetchForms has acceptOrReject API logic.

export default function Home() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["25%", "40%", "55%", "80%"];
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId: string = user?.user.id;

  const loadForms = async () => {
    try {
      if (!userId) return;
      const fetchedForms = await fetchTeacherForms(userId);
      setForms(fetchedForms);
      setLoading(false);
    } catch (err) {
      setError("Failed to load forms");
      setLoading(false);
    }
  };

  const openContactModal = () => {
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
  };

  const closeContactModal = () => {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
  };

  const handleAction = async (formId: string, requestId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      setLoading(true);
      const updatedForm = await acceptOrReject({
        requesterId: formId,
        requestId,
        requestedId: userId,
        status,
        reasonForRejection: null,
      });
      setLoading(false);
      Alert.alert("Success", `Request ${status.toLowerCase()} successfully!`);
      loadForms();
    } catch (error) {
      Alert.alert("Error", "Failed to update request status.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
    const intervalId = setInterval(loadForms, 20000);
    return () => clearInterval(intervalId);
  }, [userId]);

  const pendingForCurrentUser = forms?.filter((form) =>
    form.requests.some((req: any) => req.requestedId === userId && req.status === "PENDING")
  );

  if (loading) {
    return <ActivityIndicator animating={true} color="#7AADFE" size="small" />;
  }

  return (
    <View style={styles.container}>
      <BottomSheetModalProvider>
        {pendingForCurrentUser.length === 0 ? (
          <Text style={styles.noPendingText}>No Pending ODs</Text>
        ) : (
          <FlatList
            data={pendingForCurrentUser.reverse()}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const lastRequest =
                item.requests.length > 0
                  ? item.requests.find((req: any) => req.requestedId === userId)
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
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {statusText}
                    </Text>
                  </View>
                  <Text style={styles.formText}>Name: {item.requester.name}</Text>
                  <Text style={styles.formText}>Section: {item.requester.student.section}</Text>
                  <Text style={styles.formText}>Year: {item.requester.student.year}</Text>
                  <Text style={styles.formText}>Reason: {item.reason}</Text>
                  <Text style={styles.formText}>Category: {item.category}</Text>
                  <Text style={styles.formText}>
                    Date: {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.formText}>
                    Requested Dates:{" "}
                    {item.dates
                      .map((date: string) => new Date(date).toLocaleDateString())
                      .join(", ")}
                  </Text>

                  {/* Accept and Reject buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => handleAction(item.requesterId, lastRequest.id, "ACCEPTED")}
                    >
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleAction(item.requesterId, lastRequest.id, "REJECTED")}
                    >
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}
      </BottomSheetModalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EAEFF1",
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
