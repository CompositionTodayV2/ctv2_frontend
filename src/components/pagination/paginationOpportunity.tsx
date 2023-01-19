import React, { FC, useState, useEffect } from "react";
import {
  GridContainer,
  PageGrid,
  PageFlex,
  PageContainer,
} from "./paginationHelper";
import { Grid, MediaQuery, Pagination, Modal, Flex } from "@mantine/core";
import { useMatch } from "react-router-dom";

interface exampleItem {
  id: number;
  value: string;
}

declare enum jobType {
  teacher,
  tutor,
  professor,
  composor,
}

interface opportunityItem {
  UID: string;
  idposts: number;
  title: string;
  description: string;
  link: string;
  date_posted: Date;
  city: string;
  state: string;
  organization: string;
  end_date: Date;
  salary?: string;
  job_type?: jobType | any;
  winner?: string | null;
  category?: string;
  address?: string;
  start_date?: Date;
}

export function PaginationOpportunity() {
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPost, setCurrentPost] = useState<opportunityItem | null>(null);
  const [paginationDisplayPost, setPaginationDisplayPost] = useState<
    opportunityItem[]
  >([]);
  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    const getPageCount = async () => {
      try {
        let responseCount = await fetch(
          "https://oyster-app-7l5vz.ondigitalocean.app/compositiontoday/jobs/count"
        );

        let responseCountJson = await responseCount.json();
        console.log("API COUNT: ", responseCountJson.count);
        let numberOfPage = Math.ceil(responseCountJson.count / 4);
        setPageCount(numberOfPage);

        // let responsePost = await fetch(
        //   `https://oyster-app-7l5vz.ondigitalocean.app/compositiontoday/jobs?page_number=1`
        // );

        // let responsePostJson = await responsePost.json();
        // console.log(responsePostJson);
        // setPaginationDisplayPost(responsePostJson.listOfJobs);
      } catch (err) {
        console.log(err);
      }
    };
    getPageCount();
  }, []);

  useEffect(() => {
    const getCurrentPostPage = async () => {
      let responsePost = await fetch(
        `https://oyster-app-7l5vz.ondigitalocean.app/compositiontoday/jobs?page_number=${currentPage}`
      );

      let responsePostJson = await responsePost.json();
      setPaginationDisplayPost(responsePostJson.listOfJobs);
      setCurrentPost(responsePostJson.listOfJobs[0]);
    };

    getCurrentPostPage();
  }, [currentPage, pageCount]);

  const foo = async () => {
    try {
      let foo = await fetch(
        "https://oyster-app-7l5vz.ondigitalocean.app/compositiontoday/jobs?page_number=1"
      );
      let foobar = await foo.json();
      console.log(foobar);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostClick = (post: opportunityItem) => {
    setCurrentPost(post);
    setDisplayModal(true);
  };

  const handleCloseModal = () => {
    setDisplayModal(false);
  };

  // const renderCurrentPagePost: FC = () => {
  //   return paginationDisplayPost.map((post: exampleItem) => (
  //     <div onClick={() => handlePostClick(post)}>
  //       <h1>Number: {post.id}</h1>
  //       <p>{post.value}</p>
  //     </div>
  //   ));
  // };

  return (
    <PageContainer justify="center" align="center">
      <GridContainer>
        <PageGrid justify="center" grow>
          <Grid.Col
            style={{ border: "1px solid blue", height: "100%" }}
            span={5}
          >
            <PageFlex justify="space-around" direction="column">
              {paginationDisplayPost?.map((post: opportunityItem) => {
                return (
                  <div onClick={() => handlePostClick(post)}>
                    <h1>{post.title}</h1>
                  </div>
                );
              })}
              <Flex justify="center">
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                  <Pagination
                    page={currentPage}
                    onChange={setCurrentPage}
                    total={pageCount}
                    size="lg"
                  />
                </MediaQuery>
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Pagination
                    page={currentPage}
                    onChange={setCurrentPage}
                    total={pageCount}
                    size="xs"
                  />
                </MediaQuery>
              </Flex>
            </PageFlex>
          </Grid.Col>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Grid.Col
              style={{
                border: "1px solid green",
                overflowY: "scroll",
                height: "100%",
              }}
              span={7}
            >
              <button onClick={foo}>clicky</button>
              <h1>This is the current page you are on {currentPage}</h1>
              <h1>Title: {currentPost?.title}</h1>
            </Grid.Col>
          </MediaQuery>
        </PageGrid>
      </GridContainer>
      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <Modal opened={displayModal} onClose={handleCloseModal} fullScreen>
          <h1>This is the current page you are on {currentPage}</h1>
        </Modal>
      </MediaQuery>
    </PageContainer>
  );
}
