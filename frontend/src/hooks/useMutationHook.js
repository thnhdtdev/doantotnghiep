import { useMutation } from "@tanstack/react-query"


//tạo mới cập nhật xóa
export const useMutationHook = (fnCallback) => {
    const mutation = useMutation({
        //callback API
        mutationFn: fnCallback
    })
    return mutation
}