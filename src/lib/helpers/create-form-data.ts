/**
 * Generate formdata payload.
 * 
 * @param payload Payload
 * @returns
 */
const createFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    addObjectToFormData(formData, payload);
    return formData;
};

const addObjectToFormData = (formData: FormData, payload: any, name?: string) => {
    Object.entries(payload).forEach(([key, value]) => {
        const valuekey = name ? `${name}[${key}]` : key;
        value instanceof FileList 
            ? appendFileListToFormData(formData, value, valuekey)
            : value instanceof File || value instanceof Blob 
            ? formData.append(valuekey, value as any)
            : typeof value === 'object'
            ? addObjectToFormData(formData, value, valuekey)
            : formData.append(valuekey, value as any);
    });
}

const appendFileListToFormData = (formData: FormData, fileList: FileList, name: string) => {
    for (let count = 0; count < fileList.length; count++) {
       formData.append(name, fileList.item(count) as any);
    }
}

export default createFormData;