import React, { useState, useEffect } from "react";
import {
  GridContainer,
  PaginationGrid,
  OpportunityPageContainer,
  OpportunityItem,
  PaginationLeftColumnContent,
  PaginationLeftColumnContainer,
  PaginationRightColumnContainer,
  PaginationCard,
  PaginationNavbarContainer,
} from "./PaginationHelper";
import { OpportunityTitle } from "./PaginationOpportunityInfoHelper";
import { PaginationOpportunityInfo } from "./PaginationOpportunityInfo";
import { MediaQuery, Pagination, Modal, Flex } from "@mantine/core";
import { useLocation } from "react-router-dom";

export function PaginationOpportunity() {
  const [opportunityType, setOpportunityType] = useState(
    useLocation().pathname.slice(1)
  );
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOpportunity, setCurrentOpportunity] =
    useState<OpportunityItem | null>(null);
  const [paginationDisplayOpportunity, setPaginationDisplayOpportunity] =
    useState<OpportunityItem[]>([]);
  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    const getPageCount = async () => {
      try {
        let responseCount = await fetch(
          `https://oyster-app-7l5vz.ondigitalocean.app/compositiontoday/${opportunityType}/count`
        );

        let responseCountJson = await responseCount.json();
        console.log("API COUNT: ", responseCountJson.count);
        let numberOfPage = Math.ceil(responseCountJson.count / 4);
        setPageCount(numberOfPage);

        // let responseOpportunity = await fetch(
        //   `https://oyster-app-7l5vz.ondigitalocean.app/compositiontoday/jobs?page_number=1`
        // );

        // let responseOpportunityJson = await responseOpportunity.json();
        // console.log(responseOpportunityJson);
        // setPaginationDisplayOpportunity(responseOpportunityJson.listOfJobs);
      } catch (err) {
        console.log(err);
      }
    };
    getPageCount();
  }, []);

  useEffect(() => {
    const getCurrentOpportunityPage = async () => {
      let responseOpportunity = await fetch(
        `https://oyster-app-7l5vz.ondigitalocean.app/compositiontoday/${opportunityType}?page_number=${currentPage}`
      );

      let responseOpportunityJson = await responseOpportunity.json();
      setPaginationDisplayOpportunity(responseOpportunityJson.listOfObjects);
      setCurrentOpportunity(responseOpportunityJson.listOfObjects[0]);
      console.log(typeof responseOpportunityJson.listOfObjects[0].end_date);
    };

    getCurrentOpportunityPage();
  }, [currentPage, pageCount]);

  useEffect(() => {
    setCurrentOpportunity(paginationDisplayOpportunity[0]);
  }, [paginationDisplayOpportunity]);

  const handleOpportunityClick = (opportunity: OpportunityItem) => {
    setCurrentOpportunity(opportunity);
    setDisplayModal(true);
  };

  const handleCloseModal = () => {
    setDisplayModal(false);
  };

  return (
    <OpportunityPageContainer>
      {/* <NavBar links={navItems.links} /> */}
      <GridContainer>
        <PaginationGrid justify="center" grow>
          <PaginationLeftColumnContainer span={5}>
            <PaginationLeftColumnContent
              // justify="space-around"
              direction="column"
              gap={0}
              columnGap={0}
            >
              {paginationDisplayOpportunity?.map(
                (opportunity: OpportunityItem) => {
                  return (
                    <PaginationCard
                      onClick={() => handleOpportunityClick(opportunity)}
                    >
                      <OpportunityTitle>{opportunity.title}</OpportunityTitle>
                      <p>{opportunity.organization}</p>
                      <p>
                        {opportunity.city}, {opportunity.state}
                      </p>
                    </PaginationCard>
                  );
                }
              )}
              <PaginationNavbarContainer justify="center" align="center">
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
              </PaginationNavbarContainer>
            </PaginationLeftColumnContent>
          </PaginationLeftColumnContainer>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <PaginationRightColumnContainer span={7}>
              <PaginationOpportunityInfo
                opportunity={currentOpportunity}
                opportunityType={opportunityType}
              />
            </PaginationRightColumnContainer>
          </MediaQuery>
        </PaginationGrid>
      </GridContainer>
      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <Modal opened={displayModal} onClose={handleCloseModal} fullScreen>
          <PaginationOpportunityInfo
            opportunity={currentOpportunity}
            opportunityType={opportunityType}
          />
        </Modal>
      </MediaQuery>
    </OpportunityPageContainer>
  );
}