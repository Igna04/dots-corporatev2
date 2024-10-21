export interface Task {
    id: string;
    judulKegiatan: string;
    deskripsiKegiatan: string;
    nomorTelepon : number;
    waktuKegiatan: string; // Dapat disesuaikan dengan `Date` jika perlu
    status: string;
    date: string; // Pertimbangkan menggunakan tipe Date jika ingin mengelola tanggal dengan lebih nyaman
    lokasi: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export type TaskItems = {
    [key: string]: Task[];
};
