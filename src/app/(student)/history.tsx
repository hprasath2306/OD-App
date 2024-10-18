import { useAuth } from "@/src/providers/AuthProvider";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { fetchForms } from "@/src/api/fetchForms";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false); // To manage the refresh state
  const { user } = useAuth();
  const userId: string = user?.user.id;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

  const loadForms = async () => {
    try {
      if (!userId) return;
      const fetchedForms = await fetchForms(userId);
      setForms(fetchedForms.reverse());
      setLoading(false);
      setRefreshing(false); // End the refreshing state
    } catch (err) {
      setError("Failed to load forms");
      setLoading(false);
      setRefreshing(false); // End the refreshing state
    }
  };

  useEffect(() => {
    loadForms();
  }, [userId]);

  // Handle pull-down-to-refresh action
  const onRefresh = async () => {
    setRefreshing(true); // Show the loading spinner
    await loadForms(); // Reload the forms
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7AADFE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={forms}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
          if (statusText === "Pending") {
            return null;
          }
          return (
            <View style={styles.formItem}>
              <View style={styles.formHeader}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusText}
                </Text>
              </View>
              <Text style={styles.formText}>Reason: {item.reason}</Text>
              <Text style={styles.formText}>Category: {item.category}</Text>
              <Text style={styles.formText}>
                Date: {formatDate(item.createdAt)}
              </Text>
              <Text style={styles.formText}>
                Requested Dates: {formatDate(item.dates[0])} to{" "}
                {formatDate(item.dates[item.dates.length - 1])}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EAEFF1",
  },
  errorText: {
    color: "#D9534F",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
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
});
