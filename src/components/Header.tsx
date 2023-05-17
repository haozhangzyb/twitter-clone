import { useRouter } from "next/router";
import { type FC } from "react";
import { IoMdArrowBack } from "react-icons/io";

interface HeaderProps {
  showBackButton?: boolean;
  children: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ showBackButton, children }) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-b-slate-600 px-4">
      {showBackButton && (
        <IoMdArrowBack
          size={20}
          onClick={handleBack}
          className="cursor-pointer"
        />
      )}
      {children}
    </header>
  );
};

export default Header;
