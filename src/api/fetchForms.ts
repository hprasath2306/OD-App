import axios from "axios";

export async function fetchForms(userId: string) {
    try {
      const response = await axios.get(
        `https://od-automation.onrender.com/trpc/user.student.form.list?input="${userId}"`
      );
      return response.data.result.data;
    } catch (error: any) {
      console.error("Error fetching forms:", error.response.data);
    }
}

export async function fetchTeacherForms(userId:string){
  try {
    const response = await axios.get(
      `https://od-automation.onrender.com/trpc/user.teacher.form.list?input="${userId}"`
    );
    return response.data.result.data;
  } catch (error: any) {
    console.error("Error fetching forms:", error.response.data);
  }
}

export async function acceptOrReject(data: {
  requesterId: string;
  requestId: string;
  requestedId: string;
  status: "ACCEPTED" | "REJECTED";
  reasonForRejection: string | null;
}) {
  try {
    const response = await axios.post(
      `https://od-automation.onrender.com/trpc/user.teacher.form.acceptOrReject`,
      data
    );
    // Returning the updated form data
    return response.data.result.data;
  } catch (error: any) {
    console.error("Error accepting/rejecting form:", error?.response?.data || error.message);
    throw error;
  }
}