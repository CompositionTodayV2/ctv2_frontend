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
import {
  PaginationNavbar,
  PaginationSearchObject,
} from "../pagination/PaginationNavbar";
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
import { OpportunityFilterForm } from "./OpportunityFilterForm";

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
  const [displayOpportunityInfoModal, setDisplayOpportunityInfoModal] =
    useState(false);
  const [
    displayOpportunitySearchFilterModal,
    setDisplayOpportunitySearchFilterModal,
  ] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchObj, setSearchObj] = useState<PaginationSearchObject>({
    keyword: "",
  });
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
    setDisplayOpportunityInfoModal(true);
  };

  const handleCloseModal = () => {
    setDisplayOpportunityInfoModal(false);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = () => {
    console.log(keyword);
    setSearchObj({ ...searchObj, keyword: keyword });
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    console.log(searchObj);
  }, [searchObj]);

  return (
    <OpportunityPageContainer>
      <GridContainer medianScreen={medianScreen}>
        <SearchFilterContainer align="center">
          <SearchBar
            medianScreen={medianScreen}
            placeholder="Title or organization"
            rightSection={<IconSearch color="#808080" onClick={handleSubmit} />}
            value={keyword}
            onChange={handleSearchInput}
            onKeyDown={handleEnterKeyDown}
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
          <FilterIconContainer
            onClick={() => {
              setDisplayOpportunitySearchFilterModal(true);
            }}
          >
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
                searchFilterObject={searchObj}
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
        <Modal
          opened={displayOpportunityInfoModal}
          onClose={handleCloseModal}
          fullScreen
        >
          <OpportunityInfo
            opportunity={currentOpportunity}
            opportunityType={opportunityType}
          />
        </Modal>
      </MediaQuery>
      <Modal
        opened={displayOpportunitySearchFilterModal}
        onClose={() => {
          setDisplayOpportunitySearchFilterModal(false);
        }}
        fullScreen={medianScreen}
        size="80%"
      >
        <OpportunityFilterForm
          searchObj={searchObj}
          setSearchObj={setSearchObj}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </Modal>
    </OpportunityPageContainer>
  );
}