import React, { useState, useEffect } from "react";
import {
  GridContainer,
  OpportunityGrid,
  OpportunityPageContainer,
  OpportunityItem,
  OpportunityLeftColumnContent,
  OpportunityLeftColumnContainer,
  OpportunityRightColumnContainer,
  OpportunityCard,
  PaginationNavbarContainer,
  CityStateContainer,
  SearchBar,
  FilterIconContainer,
  SearchFilterContainer,
} from "./OpportunityHelper";
import { OpportunityTitle } from "./OpportunityInfoHelper";
import { OpportunityInfo } from "./OpportunityInfo";
import { PaginationNavbar } from "../pagination/PaginationNavbar";
import LocationIcon from "./LocationIcon.svg";
import {
  MediaQuery,
  Pagination,
  Modal,
  Flex,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useLocation } from "react-router-dom";
import { IconMapPin, IconFilter, IconSearch } from "@tabler/icons";

export function Opportunity() {
  // const [opportunityType, setOpportunityType] = useState(
  //   useLocation().pathname.slice(1)
  // );
  const opportunityType = useLocation().pathname.slice(1);
  const [currentOpportunity, setCurrentOpportunity] =
    useState<OpportunityItem | null>(null);
  const [displayOpportunityArray, setDisplayOpportunityArray] = useState<
    OpportunityItem[]
  >([]);
  const [displayModal, setDisplayModal] = useState(false);
  const medianScreen = useMediaQuery("(max-width: 992px)");

  useEffect(() => {
    if (displayOpportunityArray.length >= 0) {
      setCurrentOpportunity(displayOpportunityArray[0]);
    } else {
      setCurrentOpportunity(null);
    }
  }, [displayOpportunityArray]);

  const handleOpportunityClick = (opportunity: OpportunityItem) => {
    setCurrentOpportunity(opportunity);
    setDisplayModal(true);
  };

  const handleCloseModal = () => {
    setDisplayModal(false);
  };

  return (
    <OpportunityPageContainer>
      <GridContainer medianScreen={medianScreen}>
        <SearchFilterContainer align="center">
          <SearchBar
            medianScreen={medianScreen}
            placeholder="Title or organization"
            rightSection={<IconSearch color="#808080" />}
          />
          {/* <ActionIcon
            color="gray"
            style={{
              display: "inline-block",
              background: "white",
              marginBottom: "15px",
            }}
          >
            <IconFilter size={40} color="#808080" />
          </ActionIcon> */}
          <FilterIconContainer>
            <IconFilter size={40} color="#808080" />
          </FilterIconContainer>
        </SearchFilterContainer>
        <OpportunityGrid justify="center" medianScreen={medianScreen} grow>
          <OpportunityLeftColumnContainer span={4}>
            <OpportunityLeftColumnContent
              direction="column"
              gap={0}
              columnGap={0}
            >
              {displayOpportunityArray?.map((opportunity: OpportunityItem) => {
                return (
                  <OpportunityCard
                    selected={
                      currentOpportunity?.idposts === opportunity.idposts &&
                      !medianScreen
                    }
                    onClick={() => handleOpportunityClick(opportunity)}
                  >
                    <OpportunityTitle>{opportunity.title}</OpportunityTitle>
                    <p>{opportunity.organization}</p>
                    {/* <CityStateContainer>
                      <Flex justify="center" align="center" gap="xs">
                        <img src={LocationIcon} style={{ height: "27px" }} />
                        <span>
                          {opportunity.city}, {opportunity.state}
                        </span>
                      </Flex>
                    </CityStateContainer> */}

                    <Badge
                      leftSection={
                        <ActionIcon color="green">
                          <IconMapPin size={20} />
                        </ActionIcon>
                      }
                      color="gray"
                    >
                      {opportunity.city}, {opportunity.state}
                    </Badge>
                  </OpportunityCard>
                );
              })}
              <PaginationNavbar
                apiEndpointExtension={opportunityType}
                numberOfItemsPerPage={4}
                setListOfObjects={setDisplayOpportunityArray}
              />
            </OpportunityLeftColumnContent>
          </OpportunityLeftColumnContainer>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <OpportunityRightColumnContainer span={8}>
              <OpportunityInfo
                opportunity={currentOpportunity}
                opportunityType={opportunityType}
              />
            </OpportunityRightColumnContainer>
          </MediaQuery>
        </OpportunityGrid>
      </GridContainer>
      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <Modal opened={displayModal} onClose={handleCloseModal} fullScreen>
          <OpportunityInfo
            opportunity={currentOpportunity}
            opportunityType={opportunityType}
          />
        </Modal>
      </MediaQuery>
    </OpportunityPageContainer>
  );
}
