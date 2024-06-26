import react, { useState, useEffect } from "react";
import {
  createStyles,
  Text,
  Container,
  Group,
  Image,
  Title,
} from "@mantine/core";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { IconBrandTwitter } from '@tabler/icons';

const musicNoteIcon = require("../../images/BigMusicNote.png");
const emailIcon = require("../../images/EmailIcon.png");

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderTop: `2px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  serpLink: {
    textDecoration:"none",
    color:"#643dea",
    fontWeight:700,
  },

  logo: {
    maxWidth: 400,

    [theme.fn.smallerThan("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },

  description: {
    marginTop: 5,

    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,
      textAlign: "center",
    },
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },

  groups: {
    display: "flex",
    alignContent: "center",
    flexWrap: "wrap",

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  wrapper: {
    width: 160,
  },

  link: {
    display: "block",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: 3,
    paddingBottom: 3,

    "&:hover": {
      textDecoration: "underline",
      cursor: `pointer`,
    },
  },

  title: {
    paddingTop: 3,
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xs / 2,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  afterFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  social: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,
    },
  },

  blueText: {
    color: "#228BE6",
  },

  image: {
    maxWidth: 30,
  },

  logoGroup: {
    gap: 5,
  },

  emailIcon: {
    maxWidth: 20,
  },

  serpIcon: {
    maxWidth: 20,
  },
}));

interface FooterLinksProps {
  data: {
    title: string;
    links: { label: string; link: string }[];
  }[];
}

export function Footer({ data }: FooterLinksProps) {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [displayFooter, setDisplayFooter] = useState(true);
  const validFooterPage = [
    "/",
    "/about",
    "/jobs",
    "/competitions",
    "/festivals",
    "/concerts",
    "/admin/users",
    "/create-opportunity",
    "/admin/recent-posts",
    "/my-posts",
  ];

  useEffect(() => {
    if (validFooterPage.includes(location.pathname)) {
      setDisplayFooter(true);
    } else {
      setDisplayFooter(false);
    }
  }, [location.pathname]);

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Link 
        to={link.link} 
        key={index} 
        className={classes.link}
      >
        {link.label}
      </Link>
    ));
  
    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });
  return (
    <footer
      className={classes.footer}
      style={{ display: displayFooter ? "block" : "none" }}
    >
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Group className={classes.logoGroup}>
            <Title className={classes.title} mt="xl">
              COMPOSITION:<span className={classes.blueText}>TODAY</span>
            </Title>
            <Image
              src={String(musicNoteIcon)}
              className={classes.image}
              mt="xl"
            />
            <a
                target="_blank" href={"https://twitter.com/Composition2Day"}
                style={{
                  marginTop:"24px",
                  marginLeft:"12px",
                  textDecoration:"none",
                  color:"#1da1f2",
                  fontWeight:700,
                }}
            >
              <IconBrandTwitter
                  stroke={2}
              />
            </a>
          </Group>
          <Text size="sm" color="dimmed" className={classes.description}>
            An online hub for musicians to find jobs, competitions, festivals,
            and concerts.
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text color="dimmed" size="sm">
          © 2024 Composition Today. All rights reserved.
        </Text>

        <Text color="dimmed" size="sm">
            Resource for Event Listings:{" "}
            <a href="https://serpapi.com" target="_blank" className={classes.serpLink}>
              SerpApi
            </a>
        </Text>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <a href="mailto:composition2day@gmail.com">
            <Image src={String(emailIcon)} className={classes.emailIcon} />
          </a>
        </Group>
      </Container>
    </footer>
  );
}
