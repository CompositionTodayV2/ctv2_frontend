import {
  Paper,
  Menu,
  Badge,
  Table,
  Text,
  ActionIcon,
  ScrollArea,
  useMantineTheme,
  Container,
  createStyles,
} from "@mantine/core";
import {
  IconBan,
  IconTrash,
  IconArrowBigUpLine,
  IconCheck,
  IconArrowBigDownLine,
  IconDots,
} from "@tabler/icons";
import { auth } from "../../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { openAdminModal } from "./modals/AdminModal";
import { openDeleteModal } from "./modals/DeleteModal";
import { openBanModal } from "./modals/BanModal";
import {
  PaginationNavbar,
  PaginationSearchObject,
} from "../pagination/PaginationNavbar";
import { SearchAndFilterUsers } from "./SearchAndFilterUsers";

interface UserTableData {
  name: string;
  type: string;
  email: string;
}

export interface RawUserData {
  UID: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: number;
  is_banned: number;
}

const typeColors: Record<string, string> = {
  regular: "blue",
  admin: "green",
  banned: "red",
};

const useStyles = createStyles((theme) => ({
  container: {
    width: "80vw",
    height: "75vh",
  },

  userContainer: {
    width: "80vw",
    height: "65vh",
    display: "flex",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1,
    borderColor: "#939393",
  },

  table: {
    maxWidth: "100%",
    flexBasis: "100%",
    height: "85%",
  },

  pagination: {
    flexBasis: "100%",
    marginBottom: "80px",
    height: 0,
  },

  bold: {
    fontWeight: 700,
  },

  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      zIndex: 1,
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export function UsersList() {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [rawUserList, setRawUserList] = useState<RawUserData[]>([]);
  const [userList, setUserList] = useState<UserTableData[]>([]);
  const [searchParams, setSearchParams] = useState<PaginationSearchObject>({
    keyword: "",
    current_email: "",
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setSearchParams({ ...searchParams, current_email: user.email });
      }
    });
  }, []);

  useEffect(() => {
    convertRawUserDataToTableData();
    console.log("rawUserList", rawUserList);
  }, [rawUserList, searchParams]);

  const convertRawUserDataToTableData = () => {
    let newUserList: UserTableData[] = [];
    rawUserList?.forEach((user) => {
      let formattedUserData: UserTableData = {
        name: "",
        type: "Regular",
        email: user.email,
      };

      formattedUserData.name = user.first_name.concat(" ", user.last_name);

      if (user.is_admin === 1) formattedUserData.type = "Admin";
      if (user.is_banned === 1) formattedUserData.type = "Banned";

      newUserList.push(formattedUserData);
    });
    setUserList(newUserList);
  };

  const rows = userList?.map((item, index) => (
    <tr key={item.email}>
      <td>
        <Text size="sm" weight={500}>
          {item.name}
        </Text>
      </td>
      <td>
        <Text size="sm" color="dimmed">
          {item.email}
        </Text>
      </td>
      <td>
        <Badge
          color={typeColors[item.type.toLowerCase()]}
          variant={theme.colorScheme === "dark" ? "light" : "outline"}
        >
          {item.type}
        </Badge>
      </td>
      <td>
        <Menu>
          <Menu.Target>
            <ActionIcon color="dark" sx={{ position: "static", zIndex: 0 }}>
              <IconDots size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              disabled={item.type === "Banned" ? true : false}
              icon={
                item.type === "Admin" ? (
                  <IconArrowBigDownLine size={16} stroke={1.5} />
                ) : (
                  <IconArrowBigUpLine size={16} stroke={1.5} />
                )
              }
              onClick={
                item.type === "Admin"
                  ? () =>
                      openAdminModal(
                        item.name,
                        item.email,
                        index,
                        true,
                        setRawUserList
                      )
                  : () =>
                      openAdminModal(
                        item.name,
                        item.email,
                        index,
                        false,
                        setRawUserList
                      )
              }
            >
              {item.type === "Admin" ? "Remove Admin" : "Make Admin"}
            </Menu.Item>

            <Menu.Item
              icon={
                item.type === "Banned" ? (
                  <IconCheck size={16} stroke={1.5} />
                ) : (
                  <IconBan size={16} stroke={1.5} />
                )
              }
              onClick={
                item.type === "Banned"
                  ? () =>
                      openBanModal(
                        item.name,
                        item.email,
                        index,
                        true,
                        setRawUserList
                      )
                  : () =>
                      openBanModal(
                        item.name,
                        item.email,
                        index,
                        false,
                        setRawUserList
                      )
              }
            >
              {item.type === "Banned" ? "Unban" : "Ban"} User
            </Menu.Item>

            <Menu.Item
              icon={<IconTrash size={16} stroke={1.5} />}
              onClick={() =>
                openDeleteModal(item.name, item.email, index, setRawUserList)
              }
            >
              Delete User
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  return (
    <Container fluid className={classes.container}>
      <SearchAndFilterUsers
        email={searchParams.current_email ? searchParams.current_email : ""}
        setSearchObj={setSearchParams}
      />
      <Paper
        withBorder
        p={30}
        mt={30}
        radius="lg"
        className={classes.userContainer}
      >
        <Container className={classes.table}>
          <ScrollArea
            style={{ height: "100%" }}
            onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
          >
            <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
              <thead
                className={cx(classes.header, {
                  [classes.scrolled]: scrolled,
                })}
              >
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </Container>
        <Container className={classes.pagination}>
          <PaginationNavbar
            apiEndpointExtension={"users"}
            numberOfItemsPerPage={10}
            setListOfObjects={setRawUserList}
            searchFilterObject={searchParams}
          />
        </Container>
      </Paper>
    </Container>
  );
}
