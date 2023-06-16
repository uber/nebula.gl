import { ReactElement } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/edit-page"), {
  ssr: false,
});

export default function Page() {
  return <Map />;
}

Page.pageLayout = function pageLayout(page: ReactElement) {
  return <>{page}</>;
};
