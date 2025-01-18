import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (formData: any) => {
      try {
        const res = await fetch("/user/update", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to update user");
        }
        return data;
        // todo: fix type error with catch block
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Update successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: [`userProfile`] }),
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  return { updateProfile, isPending };
};

export default useUpdateUserProfile;
