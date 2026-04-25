"use client";

import { useEffect, useState } from "react";

import { User, Camera, Loader2, X, Check } from "lucide-react";

export default function ProfilPengguna() {
    const [user, setUser] = useState<{
    full_name: string;
    email: string;
    username: string;
    no_hp: string;
    level: string;
    image_url?: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


     useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);
  
  const getLevelStyle = (level: string) => {
    switch (level?.toLowerCase()) {
      case "basic":
        return "bg-green-100 text-green-600 border-green-200";
      case "pro":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "premium":
        return "bg-amber-100 text-amber-600 border-amber-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith("image/")) {
        setErrorMessage("File harus berupa gambar");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("Ukuran file maksimal 2MB");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        setTempPreviewUrl(reader.result as string);
        setTempFile(file);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (imageSrc: string, zoom: number): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const size = 400; // Ukuran hasil crop (square)
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");

            if (!ctx) return resolve(null);

            // Hitung dimensi gambar setelah zoom
            const imgWidth = image.width;
            const imgHeight = image.height;
            const minSide = Math.min(imgWidth, imgHeight);
            
            // Source coordinates (center crop)
            const sSize = minSide / zoom;
            const sx = (imgWidth - sSize) / 2;
            const sy = (imgHeight - sSize) / 2;

            ctx.drawImage(
                image,
                sx, sy, sSize, sSize, // Source
                0, 0, size, size      // Destination
            );

            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/jpeg", 0.9);
        };
        image.onerror = () => resolve(null);
    });
  };

  const handleFileUpload = async () => {
    if (!tempPreviewUrl || !user) return;

    setIsUploading(true);
    
    try {
        const croppedBlob = await getCroppedImg(tempPreviewUrl, zoom);
        if (!croppedBlob) throw new Error("Gagal memproses gambar");

        const formData = new FormData();
        formData.append("file", croppedBlob, "profile.jpg");
        formData.append("username", user.username);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            const updatedUser = { ...user, image_url: result.data.url };
            setUser(updatedUser);
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
            
            // Show Success Popup
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            setTempFile(null);
            setTempPreviewUrl(null);
            setZoom(1);
        } else {
            setErrorMessage(result.error || "Gagal mengunggah foto");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    } catch (error) {
        console.error("Upload error:", error);
        setErrorMessage("Terjadi kesalahan saat mengunggah foto");
        setTimeout(() => setErrorMessage(null), 3000);
    } finally {
        setIsUploading(false);
    }
  };

  const cancelPreview = () => {
    setTempFile(null);
    setTempPreviewUrl(null);
  };
  return (
    <div className=" p-4 rounded-lg px-0">
        <h1 className="text-black dark:text-white font-bold text-2xl mb-6">Profil Pengguna</h1>

        <div className="text-black dark:text-white flex flex-col bg-white dark:bg-neutral-900 rounded-[32px] shadow-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
            {/* fullname, email, level */}
            <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border-4 border-white dark:border-neutral-800 shadow-lg">
                        {user?.image_url ? (
                            <img src={user.image_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="text-white" width={50} height={50}/>
                        )}
                    </div>
                    
                    <label 
                        htmlFor="photo-upload" 
                        className={`absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md transition-all duration-200 ${isUploading ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}
                    >
                        {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Camera className="w-4 h-4" />
                        )}
                        <input 
                            id="photo-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </label>
                </div>

                {/* Preview Modal */}
                {tempPreviewUrl && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
                        <div className="bg-white dark:bg-neutral-900 rounded-[32px] shadow-2xl p-6 w-full max-w-sm border border-gray-100 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in duration-300">
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2 text-center">Sesuaikan Foto</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Gunakan slider untuk menyesuaikan crop</p>
                            
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800 mb-4 group border-2 border-dashed border-gray-200 dark:border-white/10">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img 
                                        src={tempPreviewUrl} 
                                        alt="Preview" 
                                        style={{ transform: `scale(${zoom})` }}
                                        className="w-full h-full object-contain transition-transform duration-200" 
                                    />
                                </div>
                                {/* Crop Overlay Guide */}
                                <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none flex items-center justify-center">
                                    <div className="w-full h-full border-2 border-white/50 rounded-full shadow-[0_0_0_1000px_rgba(0,0,0,0.4)]"></div>
                                </div>
                            </div>

                            <div className="mb-6 px-2">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">
                                    <span>Zoom</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="3" 
                                    step="0.01" 
                                    value={zoom} 
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={cancelPreview}
                                    disabled={isUploading}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
                                >
                                    <X size={18} />
                                    Batal
                                </button>
                                <button
                                    onClick={handleFileUpload}
                                    disabled={isUploading}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70"
                                >
                                    {isUploading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Check size={18} />
                                            Simpan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Toast */}
                {showSuccess && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-5 fade-in duration-500">
                        <div className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-500">
                            <div className="bg-white/20 p-1 rounded-full">
                                <Check size={16} />
                            </div>
                            <span className="font-bold text-sm">Foto profil berhasil diperbarui!</span>
                        </div>
                    </div>
                )}

                {/* Error Toast */}
                {errorMessage && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-5 fade-in duration-500">
                        <div className="bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-500">
                            <div className="bg-white/20 p-1 rounded-full">
                                <X size={16} />
                            </div>
                            <span className="font-bold text-sm">{errorMessage}</span>
                        </div>
                    </div>
                )}
                <div className="text-black dark:text-white flex flex-col items-center md:items-start gap-2">
                    <p className="text-2xl font-black">{user?.full_name}</p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.no_hp}</p>
                    <div className={`mt-1 w-min inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getLevelStyle(user?.level || "")}`}>
                        {user?.level || "basic"}
                    </div>
                </div>
            </div>

            {/* Container fullname and email */}
            <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-6">
                <div className="flex flex-col gap-3">
                    <label htmlFor="full_name" className="text-xs uppercase font-bold text-gray-400 tracking-widest">Username</label>
                    <input type="text" name="full_name" id="full_name" value={user?.username} readOnly className="border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 font-medium text-black dark:text-white" disabled />
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="email" className="text-xs uppercase font-bold text-gray-400 tracking-widest">Alamat Email</label>
                    <input type="text" name="email" id="email" value={user?.email} readOnly className="border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 font-medium text-black dark:text-white" disabled />
                </div>
            </div>
            
        </div>
    </div>
  )
}