"use client";
import React, { useEffect, useRef, useCallback, useState, Suspense } from "react";
import { Search } from "lucide-react";
import Anime from "@/types/animetypes";
import SearchCards from "./cards/SearchCards";
const SearchModal = ({ trending }: { trending: Anime[] }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const closeSearchModal = () => {
        setOpenSearch(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.keyCode === 32) {
                setOpenSearch((prevState) => !prevState);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeSearchModal();
            }
        },
        [closeSearchModal],
    );

    useEffect(() => {
        if (openSearch) {
            document.body.style.overflow = "hidden";
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.body.style.overflow = "auto";
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.body.style.overflow = "auto";
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openSearch, handleClickOutside]);
    const handleModalClose = () => {
        setOpenSearch(!openSearch);
    };
    return (
        <>
            <Search className="cursor-pointer" onClick={() => setOpenSearch(!openSearch)} />
            <div className={`bg-black/25 overscroll-none w-screen backdrop-blur h-screen fixed p-4 left-0 top-0 bottom-0 duration-200 right-0 ${openSearch ? "scale-100" : "scale-0"}`}>
                <div className="flex h-screen items-center right-5 top-5">
                    <div className="bg-white/75 h-96 overflow-y-scroll  gap-4 flex-col rounded-lg p-4 max-w-3xl m-auto w-screen text-black flex" ref={modalRef}>
                        <h1 className="font-bold text-lg flex gap-3 items-center">
                            Open/Close : <span className=" bg-black text-white p-2 rounded-lg text-sm">Ctrl</span>+ <span className=" bg-black text-white text-sm p-2 rounded-lg">Space</span>
                        </h1>
                        <input type="text" placeholder="I am looking for ......" className="border-2 bg-black border-none outline-none focus:outline-none p-4 w-full rounded-lg text-white" />
                        <h1 className=" text-2xl font-semibold">Trending</h1>
                        <Suspense fallback={<>Loading...</>}>
                            <SearchCards results={trending} modalClose={handleModalClose} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchModal;
