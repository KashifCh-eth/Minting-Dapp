import React, { useEffect, useState, useRef } from "react";
import Button from "./Button";
import SocialFollow from "./SocialFollow";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  padding: 20px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px soild var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;
export const StyledTeam = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  width: 40px;
  border-radius: 50%;
  @media (min-width: 900px) {
    width: 40px;
  }
  @media (min-width: 1000px) {
    width: 40px;
  }
`;
export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2) {
      newMintAmount = 2;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.gif" : null}
      >
        <s.Container flex={1} jc={"center"} ai={"center"}>
          <StyledImg alt={"example"} src={"/config/images/polyshards.gif"} />
        </s.Container>
        <StyledLogo alt={"logo"} src={"/config/images/logo.gif"} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 0,
              border: "4px soild var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1{" "}
                  <span
                    style={{
                      color: "var(--phase-color)",
                    }}
                  >
                    {CONFIG.SYMBOL}
                  </span>{" "}
                  COST {CONFIG.DISPLAY_COST}{" "}
                  <span
                    style={{
                      color: "var(--fourth-color)",
                    }}
                  >
                    {CONFIG.NETWORK.SYMBOL}.
                  </span>
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                  <span
                    style={{
                      color: "var(--secondary)",
                    }}
                  >
                    <br />
                    Whitelist Mint Date: 08/28/2022
                    <br />
                    Public Mint Date: 08/29/2022
                    <br />
                  </span>
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>

                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/polyshards.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 0,
              border: "4px soild var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              <span
                style={{
                  color: "var(--fourth-color)",
                }}
              >
                Gif R
                <span
                  style={{
                    color: "var(--secondary)",
                  }}
                >
                  EVOLUTION
                </span>{" "}
                NFT
              </span>
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              ★彡[ᴛʜɪꜱ ᴄᴏʟʟᴇᴄᴛɪᴏɴ ᴏꜰ 10000 ɴꜰᴛ ɢɪꜰꜱ ᴡʜɪᴄʜ ɪꜱ ᴛʜᴇ ꜰɪʀꜱᴛ
              ʀᴇᴠᴏʟᴜᴛɪᴏɴ ɪɴ ᴛʜᴇ ᴡᴏʀʟᴅ ᴏꜰ ɴꜰᴛ, ᴛʜᴇ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ᴀʀᴇ ɴᴏ ʟᴏɴɢᴇʀ
              ꜱᴛᴀᴛɪᴄ, ʙᴜᴛ ɪɴᴛᴇʀᴀᴄᴛ ᴡɪᴛʜ ᴇᴀᴄʜ ᴏᴛʜᴇʀ, ɪᴛ ɪꜱ ɴᴏᴛ ᴛʜᴇ ᴜꜱᴜᴀʟ ᴍᴏᴠᴇᴍᴇɴᴛ
              ᴏꜰ ᴛʜᴇ ᴇʏᴇꜱ ᴏʀ ᴛʜᴇ ʜᴇᴀᴅ ʜᴇʀᴇ ᴛʜᴇʀᴇ ɪꜱ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴀᴄᴛɪᴏɴ ᴡɪᴛʜ ᴇᴀᴄʜ
              ɴꜰᴛ ᴛʜɪꜱ ᴄᴏʟʟᴇᴄᴛɪᴏɴ ᴡɪʟʟ ʙᴇ ᴘᴀɪʀᴇᴅ ʙʏ ᴇᴠᴇʀʏᴏɴᴇ ɪɴ ᴛʜᴇ ᴡᴏʀʟᴅ ᴏꜰ ɴꜰᴛ
              ɢɪꜰ ᴘʀᴏᴊᴇᴄᴛꜱ ʜᴜʀʀʏ ᴜᴘ ᴛᴏ ʙᴇ ᴛʜᴇ ꜰɪʀꜱᴛ, ɪꜰ ʏᴏᴜ ʜᴀᴠᴇ ɪɢɴᴏʀᴇᴅ ᴛʜᴇ
              ᴄʀʏᴘᴛᴏᴘᴜɴᴋꜱ ᴏʀ ʙᴏʀᴇᴅ ᴀᴘᴇ ʏᴄ ɴᴏᴡ ʏᴏᴜ ʜᴀᴠᴇ ᴛʜᴇ ᴏᴘᴘᴏʀᴛᴜɴɪᴛʏ.]彡★
              <br />
              <br />
              <SocialFollow />
              <br />
              <Button />
            </s.TextDescription>
            <s.SpacerSmall />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/polyshards.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 0,
              border: "4px soild var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              >
                {" "}
                <s.TextTitle
                  style={{
                    textAlign: "center",
                    fontSize: 50,
                    fontWeight: "bold",
                    color: "var(--accent-text)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--secondary)",
                    }}
                  >
                    GIFREVNFT ROADMAP
                  </span>
                </s.TextTitle>
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--primary-text)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--fourth-color)",
                      textAlign: "center",
                      fontSize: 30,
                      fontWeight: "bold",
                    }}
                  >
                    𝖜𝖊𝖑𝖈𝖔𝖒𝖊 𝖙𝖔 𝖌𝖎𝖋𝖗𝖊𝖛𝖑𝖓𝖋𝖙𝖘
                  </span>
                  <br />
                  <br />
                  <span
                    style={{
                      color: "var(--phase-color)",
                      fontSize: 20,
                    }}
                  >
                    PHASE 1 - PUBLICITY
                  </span>
                  <br />
                  <br />
                  We need to let the world know that we exist, and our Swiss
                  project which is the first of its kind in the world, for an
                  NFT GIF that includes for the first time, 2 NFT characters
                  interacting with each other. We plan to improve our publicity
                  and visibility by; building a website that matches our project
                  and leveraging social media platforms like Twitter, Instagram,
                  and Discord.
                  <br />
                  <br />
                  There would be more work to do and so we will expand the team
                  by getting more effective team members, and we will work on
                  finalizing the artwork.
                  <br />
                  <br />
                  <span
                    style={{
                      color: "var(--phase-color)",
                      fontSize: 20,
                    }}
                  >
                    PHASE 2 - LISTING
                  </span>
                  <br />
                  <br />
                  Getting listed on NFT Calendar Drop Websites is one of our
                  biggest goals for the second phase. We would also grow our
                  social media accounts to improve our online presence and also
                  communicate with our community better. The Twitter Raids
                  start, followed by opening our Whitelist.
                  <br />
                  <br />
                  <span
                    style={{
                      color: "var(--phase-color)",
                      fontSize: 20,
                    }}
                  >
                    <br />
                    PHASE 3 - LAUNCH
                  </span>
                  <br />
                  <br />
                  This phase begins by starting the Mint <br />
                  Mint Price: 0.025 <br />
                  Whitelist Mint Date: 08/28/2022 <br />
                  Public Mint Date: 08/29/2022
                  <br />
                  The Mint Site is Ready to be launched!
                  <br />
                  <span style={{}}>
                    <br />
                    Giveaways start on our social media platforms, 500 GIFREVNFT
                    will be minted by the team and will be used for giveaways,
                    rewards, and the creator's GIFREVNFT membership. We continue
                    the Twitter Raids that started in phase 2.
                    <br />
                    Organize Twitter Spaces; this will enable the community
                    members to participate and engage in important discussions,
                    improve communication, and answer questions within the
                    community.
                    <br />
                    <br />
                  </span>
                  <span
                    style={{
                      color: "var(--primary)",
                      fontSize: 25,
                    }}
                  >
                    Team
                    <br />
                    Founder &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    <StyledTeam
                      alt={"example"}
                      src={"/config/images/team.webp"}
                      style={{ transform: "scaleX(-1)" }}
                    />
                    <br /> Web ingenieur &nbsp;&nbsp;&nbsp;&nbsp;
                    <StyledTeam
                      alt={"example"}
                      src={"/config/images/team2.webp"}
                      style={{ transform: "scaleX(-1)" }}
                    />
                  </span>
                  <br />
                  <br />
                </s.TextDescription>
              </s.TextDescription>
            </s.Container>
          </s.Container>
        </ResponsiveWrapper>
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 0,
              border: "4px soild var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              >
                GIF-REV-NFT CONTRACT <br />
                <span
                  style={{
                    color: "var(--third-color)",
                  }}
                >
                  ADDRESS
                </span>{" "}
                <br />
                <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                  {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                </StyledLink>
              </s.TextDescription>
            </s.Container>
          </s.Container>
        </ResponsiveWrapper>
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 0,
              border: "4px soild var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              >
                Please make sure you are connected to the right network (
                {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please
                note: Once you make the purchase, you cannot undo this action.
              </s.TextDescription>
              <s.SpacerSmall />
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              >
                We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract
                to successfully mint your NFT. We recommend that you don't lower
                the gas limit.
              </s.TextDescription>
            </s.Container>
          </s.Container>
        </ResponsiveWrapper>

        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            &#169;2022 - gifrevlnfts
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
