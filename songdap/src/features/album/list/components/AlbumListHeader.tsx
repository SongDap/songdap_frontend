// components/AlbumListHeader.tsx
import { useState } from "react";
import type { UserInfo } from "@/features/oauth/model/types";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { AddAlbumCard } from "./AddAlbumCard";

interface AlbumListHeaderProps {
    user: UserInfo | null;
    totalCount: number;
}

export function AlbumListHeader({ user, totalCount }: AlbumListHeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleMouseEnter = () => setIsDropdownOpen(true);
    const handleMouseLeave = () => setIsDropdownOpen(false);
    const { logout } = useOauthStore();

    return (
        <header className="w-full flex items-start justify-between pt-6">
            <div>
                <h1
                    className="text-[80px] md:text-[90px] font-extrabold tracking-tight leading-none"
                    style={{ fontFamily: "hssaemaeul" }}
                >
                    <span className="text-[#4A86E8]">{user?.nickname ?? "사용자"}</span> 님의 Album
                </h1>

                <div className="mt-4 flex items-center justify-between w-full"> {/* 양쪽정렬 */}
                    <h2 className="text-[20px] text-black/70">
                        {totalCount === 0 ? (
                            "아직 발매한 앨범이 없어요..."
                        ) : (
                            <>
                                지금까지 총 <span className="text-red-500 font-bold">{totalCount}</span>개의 앨범을 발매했어요
                            </>
                        )}
                    </h2>

                    <div className="flex items-center gap-6">
                        <AddAlbumCard />
                        <button className="text-[18px] font-semibold text-black hover:opacity-80">
                            편집
                        </button>
                    </div>
                </div>


                <div className="mt-4 flex items-center justify-between">
                    <div></div> {/* 왼쪽 공간 */}
                    <div className="flex items-center gap-4 text-[14px] text-black/70">
                        <button type="button" className="hover:opacity-70">
                            가나다순
                        </button>
                        <button type="button" className="hover:opacity-70">
                            최신순
                        </button>
                        <button type="button" className="hover:opacity-70">
                            인기순
                        </button>
                    </div>
                </div>
            </div>

            {/* 우측 드롭다운 */}
            <div
                className="relative flex items-center gap-2 text-[14px] font-semibold text-black/70 cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/30 bg-white">
                    👤
                </span>
                {user?.nickname ?? "게스트"}

                {isDropdownOpen && (
                    <div className="absolute top-full right-0 pt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <ul className="py-1">
                            <li>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    닉네임 수정
                                </button>
                            </li>
                            <li>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    프로필 사진 수정
                                </button>
                            </li>
                            <li>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    onClick={logout}
                                >
                                    로그아웃
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}