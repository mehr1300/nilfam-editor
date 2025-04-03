import {useEffect, useState} from 'react';
import {XIcon} from "../../assets/icons/Icons.jsx";
import {t} from "../Lang/i18n.js";

export default function UploadModalVideo({ openUploadVideo, setOpenUploadVideo, editor,lang }) {
     const [activeTab, setActiveTab] = useState('upload');
    const [videos, setVideos] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [embedCode, setEmbedCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!openUploadVideo) {
             setVideos([]);
            setUploadProgress(0);
            setIsUploading(false);
            setVideoUrl('');
            setEmbedCode('');
            setErrorMessage('');
            setActiveTab('upload');
        }
    }, [openUploadVideo]);

    if (!openUploadVideo) {
         return null;
    }

    const handleDragOver = (e) => {
         e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
         e.preventDefault();
        e.stopPropagation();
        const droppedFiles = Array.from(e.dataTransfer.files);
         const validVideos = droppedFiles.filter((file) => file.type.startsWith('video/'));
        console.log("Valid video files:", validVideos);
        if (validVideos.length === 0) {
            console.log("No valid video files dropped");
            setErrorMessage('لطفاً فقط فایل‌های ویدئویی را آپلود کنید.');
            return;
        }
        setVideos((prev) => [...prev, ...validVideos]);
        setErrorMessage('');
    };

    const handleFileSelect = (e) => {
        console.log("handleFileSelect event:", e);
        const selectedFiles = Array.from(e.target.files);
        console.log("Selected files:", selectedFiles);
        const validVideos = selectedFiles.filter((file) => file.type.startsWith('video/'));
        console.log("Valid videos from selection:", validVideos);
        if (validVideos.length === 0 && selectedFiles.length > 0) {
            console.log("No valid video files selected");
            setErrorMessage('لطفاً فقط فایل‌های ویدئویی را انتخاب کنید.');
            return;
        }
        setVideos((prev) => [...prev, ...validVideos]);
        setErrorMessage('');
    };

    const handleRemoveVideo = (index) => {
        console.log("Removing video at index:", index);
        setVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        console.log("handleUpload triggered");
        if (!videos.length) {
            console.log("No videos selected for upload");
            setErrorMessage('لطفاً ابتدا یک فایل ویدئویی انتخاب کنید.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setErrorMessage('');

        let fakeProgress = 0;
        const interval = setInterval(() => {
            fakeProgress += 10;
            setUploadProgress(fakeProgress);
            console.log("Upload progress:", fakeProgress);
            if (fakeProgress >= 100) {
                clearInterval(interval);
            }
        }, 500);

        const formData = new FormData();
        videos.forEach((video, idx) => {
            console.log(`Appending video ${idx}:`, video);
            formData.append('videos', video);
        });

        try {
            console.log("Sending upload request to /api/upload-video");
            const res = await fetch('/api/upload-video', {
                method: 'POST',
                body: formData,
            });
            console.log("Upload response received:", res);

            if (res.ok) {
                const data = await res.json();
                console.log("Upload success, server response data:", data);
                if (data?.url) {
                    insertVideoInEditor(data.url);
                } else {
                    console.log("Server response does not contain URL");
                    setErrorMessage('پاسخ سرور فاقد URL است.');
                }
            } else {
                const errorData = await res.json().catch(() => ({ message: 'خطای آپلود' }));
                console.log("Upload error, server responded with error:", errorData);
                setErrorMessage(errorData.message || `خطای سرور: ${res.status}`);
                clearInterval(interval);
                setIsUploading(false);
                return;
            }
        } catch (error) {
            console.error("Fetch error during upload:", error);
            setErrorMessage('خطا در ارتباط با سرور. لطفاً مجدد تلاش کنید.');
            clearInterval(interval);
            setIsUploading(false);
            return;
        }

        setTimeout(() => {
            console.log("Upload completed, closing modal");
            setIsUploading(false);
            setOpenUploadVideo(false);
        }, 1000);
    };

    // تغییر: استفاده از type "video" به جای "videoElement"
    const insertVideoInEditor = (src) => {
        console.log("insertVideoInEditor called with src:", src);
        if (!editor) {
            console.error("Editor instance not available");
            return;
        }
        try {
            const videoSrc = src.trim();
            if (!videoSrc) {
                console.log("Video src is empty after trimming");
                setErrorMessage('آدرس ویدئو معتبر نیست.');
                return;
            }

            // درج نود ویدئو به صورت جداگانه (نه داخل پاراگراف)
            console.log("Using editor.commands.insertContent to insert video");
            editor.commands.insertContent({
                type: 'video', // توجه کنید که نام نود باید با نام تعریف‌شده در extension مطابقت داشته باشد.
                attrs: {
                    src: videoSrc,
                    preload: "none", // این خط باعث می‌شود که مرورگر از بارگذاری خودکار ویدئو صرفنظر کند
                    controls: true,
                    style: 'width:500px; max-width:100%;padding"10px'
                }
            });
            console.log("Video inserted with src:", videoSrc);
        } catch (error) {
            console.error("Error inserting video:", error);
            setErrorMessage('خطا در درج ویدئو در ادیتور: ' + error.message);
        }
    };




    const handleInsertVideoFromUrl = () => {
        console.log("handleInsertVideoFromUrl triggered with videoUrl:", videoUrl);
        if (!videoUrl.trim()) {
            console.log("Video URL is empty");
            setErrorMessage('لطفاً یک آدرس ویدئو وارد کنید.');
            return;
        }
        if (!videoUrl.trim().match(/^https?:\/\//i)) {
            console.log("Video URL does not start with http/https");
            setErrorMessage('لطفاً یک آدرس اینترنتی معتبر وارد کنید.');
            return;
        }
        insertVideoInEditor(videoUrl);
        setOpenUploadVideo(false);
    };

    const handleInsertEmbedCode = () => {
        console.log("handleInsertEmbedCode triggered with embedCode:", embedCode);
        setErrorMessage('');
        if (!embedCode.trim()) {
            console.log("Embed code is empty");
            setErrorMessage('لطفاً کد iframe را وارد کنید.');
            return;
        }
        const iframeRegex = /<iframe\s[^>]*src=["']([^"']+)["'][^>]*><\/iframe>/i;
        const match = embedCode.trim().match(iframeRegex);
        console.log("Result of iframe regex match:", match);
        if (!match) {
            console.log("Embed code did not match the iframe regex");
            setErrorMessage('لطفاً کد iframe معتبر وارد کنید (فقط iframe).');
            return;
        }
        const srcValue = match[1];
        console.log("Extracted src from embed code:", srcValue);
        const isYoutube = srcValue.includes('youtube.com') || srcValue.includes('youtu.be');
        const isAparat = srcValue.includes('aparat.com');
        if (!isYoutube && !isAparat) {
            console.log("Embed code src is not from Youtube or Aparat");
            setErrorMessage('فقط iframe از دامنه‌های youtube.com یا aparat.com مجاز است.');
            return;
        }
        try {
            if (!editor) {
                console.error("Editor instance not available for embed code");
                setErrorMessage('ادیتور در دسترس نیست.');
                return;
            }
            const secureEmbed = embedCode.replace('<iframe', '<iframe loading="lazy" sandbox="allow-scripts allow-same-origin"');
            console.log("Secure embed code to insert:", secureEmbed);
            editor.chain().focus().insertContent(secureEmbed).run();
            console.log("Embed code inserted successfully");
            setOpenUploadVideo(false);
        } catch (error) {
            console.error("Error inserting embed code:", error);
            setErrorMessage('خطا در درج کد embed.');
        }
    };

    return (
        <div
            className="fixed inset-0 z-40 backdrop-blur-xs flex items-center justify-center px-2"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    console.log("Backdrop clicked, closing modal");
                    setOpenUploadVideo(false);
                }
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="bg-white border border-gray-200 p-5 w-full max-w-2xl flex flex-col gap-4 md:my-10 rounded-lg shadow-lg relative">
                <div className="flex flex-row justify-between items-center mb-1">
                    <span className="font-bold"> {t('addVideo', lang)}</span>
                    <button onClick={() => {setOpenUploadVideo(false);}} className="cursor-pointer text-gray-700 hover:text-gray-500" aria-label= {t('close', lang)}>
                        <XIcon/>
                    </button>
                </div>
                <div className="flex border-b border-gray-300 mb-3">
                    <button onClick={() => {setActiveTab('upload');setErrorMessage('');}} className={`py-2 px-4 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}>
                        {t('uploadFile', lang)}
                    </button>
                    <button onClick={() => {setActiveTab('url');setErrorMessage('');}} className={`py-2 px-4 ${activeTab === 'url' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}>
                        {t('directLink', lang)}
                    </button>
                    <button
                        onClick={() => {
                            console.log("Switched to embed tab");
                            setActiveTab('embed');
                            setErrorMessage('');
                        }}
                        className={`py-2 px-4 ${activeTab === 'embed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                    >
                        Embed (فقط یوتیوب/آپارات)
                    </button>
                </div>
                {errorMessage && (
                    <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md border border-red-200">
                        {errorMessage}
                    </div>
                )}
                {activeTab === 'upload' && (
                    <div>
                        <div
                            className="flex flex-col text-gray-500 justify-center items-center border-2 border-dashed border-gray-400 rounded-xl p-8 hover:border-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                            onClick={() => {
                                console.log("Upload area clicked, triggering file input");
                                document.getElementById('videoInput').click();
                            }}
                        >
                            <p className="text-center mb-2">
                                {t('dragUpload', lang)}
                            </p>
                            <p className="text-xs text-gray-400">فرمت‌های مجاز: MP4, WebM, MOV, AVI</p>
                            <input
                                id="videoInput"
                                type="file"
                                multiple
                                accept="video/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                        {videos.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-semibold mb-2">فایل‌های انتخاب شده:</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {videos.map((file, index) => (
                                        <div key={index} className="relative bg-gray-100 rounded-md p-2 pr-8">
                                            <div className="text-sm truncate max-w-xs">{file.name}</div>
                                            <button
                                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveVideo(index);
                                                }}
                                                aria-label="حذف فایل"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {isUploading && (
                            <div className="mt-4">
                                <p className="text-sm mb-1">در حال آپلود... {uploadProgress}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-row gap-2 justify-end mt-4">
                            <button className={`rounded px-4 py-2 text-white ${isUploading || videos.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'}`} onClick={handleUpload} disabled={isUploading || videos.length === 0}>
                                {t('add', lang)}
                            </button>
                            <button className="rounded bg-gray-300 hover:bg-gray-200 px-4 py-2" onClick={() => {console.log("Cancel button clicked on upload tab");setOpenUploadVideo(false);}} disabled={isUploading}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}
                {activeTab === 'url' && (
                    <div>
                        <label className="flex flex-col text-sm mb-2">
                            {t('addressFile', lang)}
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => {
                                    console.log("Video URL changed to:", e.target.value);
                                    setVideoUrl(e.target.value);
                                }}
                                className="border border-gray-400 rounded px-2 py-1.5 text-sm mt-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="https://server.com/video.mp4"
                            />
                        </label>

                        <div className="flex flex-row gap-2 justify-end mt-4">
                            <button className={`rounded px-4 py-2 text-white ${!videoUrl.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400'}`} onClick={handleInsertVideoFromUrl} disabled={!videoUrl.trim()}>
                                {t('add', lang)}
                            </button>
                            <button className="rounded bg-gray-300 hover:bg-gray-200 px-4 py-2" onClick={() => {console.log("Cancel button clicked on URL tab");setOpenUploadVideo(false);}}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}
                {activeTab === 'embed' && (
                    <div>
                        <label className="flex flex-col text-sm mb-2">
                            کد iframe (فقط Youtube یا Aparat):
                            <textarea
                                rows={4}
                                className="border border-gray-400 rounded px-2 py-1.5 text-sm mt-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder='<iframe src="https://www.aparat.com/video/..."></iframe>'
                                value={embedCode}
                                onChange={(e) => {
                                    console.log("Embed code changed:", e.target.value);
                                    setEmbedCode(e.target.value);
                                }}
                            />
                        </label>
                        <p className="text-xs text-gray-500 mb-4">
                            {t('embedDesc', lang)}
                        </p>
                        <div className="flex flex-row gap-2 justify-end mt-4">
                            <button className={`rounded px-4 py-2 text-white ${!embedCode.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400'}`} onClick={handleInsertEmbedCode} disabled={!embedCode.trim()}>
                                {t('add', lang)}
                            </button>
                            <button className="rounded bg-gray-300 hover:bg-gray-200 px-4 py-2" onClick={() => {setOpenUploadVideo(false);}}>
                                {t('close', lang)}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
