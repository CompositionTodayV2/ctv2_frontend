import {
  TextInputFullWidth,
  OpportunityFormContainer,
  OpportunityFormContentContainer,
  TwoInputRow,
  DescriptionInput,
  EndDateInput,
  StartEndDatePicker,
  SalaryInput,
  SubmitButtonContainer,
} from "./OpportunityFormHelper";
import { OpportunityItem } from "./OpportunityHelper";
import { Location } from "../filter/Location";
import React, { useState, useEffect } from "react";
import { Paper, NumberInput, Button } from "@mantine/core";
import { DateRangePickerValue } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";

interface OpportunityFormProp {
  opportunityType: string;
  opportunity?: OpportunityItem;
}

export function OpportunityForm({
  opportunityType,
  opportunity,
}: OpportunityFormProp) {
  const [city, setCity] = useState(opportunity?.city ? opportunity.city : "");
  const [state, setState] = useState("");
  const [dateRange, setDateRange] = useState<DateRangePickerValue>([
    null,
    null,
  ]);
  const [salary, setSalary] = useState<number>(0);
  const medianScreen = useMediaQuery("(max-width: 992px)");
  const form = useForm({
    initialValues: {
      // FIXME: Need to actually put the UID of the logged in user here
      UID: opportunity?.UID || "",
      idposts: opportunity?.idposts || -1,
      title: opportunity?.title || "",
      link: opportunity?.link || "",
      organization: opportunity?.organization || "",
      description: opportunity?.description || "",
      date_posted: new Date(),
      city: opportunity?.city || "",
      state: opportunity?.state || "",
      end_date: opportunity?.end_date || "",
      salary: opportunity?.salary || "",
      job_type: opportunity?.job_type || "",
      winner: opportunity?.winner || "",
      category: opportunity?.category || "",
      address: opportunity?.address || "",
      start_date: opportunity?.start_date || "",
    },
    validate: {
      UID: (value) => (value ? null : "Need to give a UID"),
      title: (value) => (value ? null : "Please give a title"),
      link: (value) => (value ? null : "Please give a link"),
      organization: (value) =>
        value ? null : "Please give an organization name",
      description: (value) => (value ? null : "Please give a description"),
      date_posted: (value) => (value ? null : "Need to give a date posted"),
      city: (value) => (value ? null : "Please give a city"),
      state: (value) => (value ? null : "Please give a state"),
      end_date: (value: Date | string) =>
        value ? null : "Please give an end date",
      salary: (value) =>
        value || opportunityType !== "jobs" ? null : "Please give a salary",
      job_type: (value) => (value ? null : "Please give the type of job"),
      category: (value) => (value ? null : "Please give the category"),
      address: (value) => (value ? null : "Please give an address"),
      start_date: (value: Date | string) =>
        value ? null : "Please give a start date",
    },
  });

  useEffect(() => {
    console.log(opportunityType);
  }, [opportunityType]);

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  return (
    <OpportunityFormContainer>
      <Paper shadow="sm" withBorder>
        <OpportunityFormContentContainer>
          <form
            onSubmit={form.onSubmit((values) => {
              console.log(values);
            })}
          >
            <TextInputFullWidth
              label="Title"
              placeholder="Title"
              withAsterisk
              {...form.getInputProps("title")}
            />
            <TwoInputRow
              justify="space-around"
              gap="md"
              direction={medianScreen ? "column" : "row"}
            >
              <TextInputFullWidth
                label="Organization"
                placeholder="Organization"
                withAsterisk
                {...form.getInputProps("organization")}
              />
              <TextInputFullWidth
                label="Link"
                placeholder="Link"
                withAsterisk
                {...form.getInputProps("link")}
              />
            </TwoInputRow>
            <DescriptionInput
              label="Description"
              placeholder="Description"
              autosize
              withAsterisk
              minRows={5}
              {...form.getInputProps("description")}
            />
            <Location
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
            />
            <TwoInputRow
              justify="space-around"
              gap="md"
              direction={medianScreen ? "column" : "row"}
            >
              <SalaryInput
                label="Salary"
                placeholder="Please give an amount"
                value={salary}
                defaultValue={0}
                onChange={(e) => {
                  if (e) setSalary(e);
                  else setSalary(0);
                }}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value ? value : ""))
                    ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "$ "
                }
                withAsterisk
              />
              <TextInputFullWidth
                label="Job Type"
                placeholder="Job Type"
                withAsterisk
              />
            </TwoInputRow>
            <TextInputFullWidth
              label="Winner"
              placeholder="Give the name of the winner if applicable"
            />
            <TextInputFullWidth
              label="Category"
              placeholder="Category"
              withAsterisk
            />
            <TextInputFullWidth
              label="Address"
              placeholder="Address"
              withAsterisk
            />
            <EndDateInput
              placeholder="End Date"
              label="End Date"
              withAsterisk
            />
            <StartEndDatePicker
              placeholder="Choose start and end date"
              label="Date Range"
              value={dateRange}
              onChange={setDateRange}
              withAsterisk
            />
            <SubmitButtonContainer justify="center">
              <Button type="submit">Submit</Button>
            </SubmitButtonContainer>
          </form>
        </OpportunityFormContentContainer>
      </Paper>
    </OpportunityFormContainer>
  );
}
