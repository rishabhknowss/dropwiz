import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/app/stores",
      permanent: false,
    },
  };
};

const AppIndex = () => null;

export default AppIndex;
