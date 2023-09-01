import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";
import { People, PersonGear } from "react-bootstrap-icons";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import {
  getDataBaseUserProfile,
  getUserProfile,
} from "../../../UI/SignUp/SignUp.utils";
import AutocompleteUserSearch from "./AutocompleteUserSearch";
import {
  UseLanguageReviewOutput,
} from "./hooks/useLanguageReview";
import { ExternalServices } from "./index.constants";
import { Service } from "./index.structures";
import { Review, ReviewUser } from "./index.types";
import { getOwner } from "./index.utils";

export default function LanguageReview({
  owner,
  setOwner,
  review,
  setReview,
  enableReview,
  setEnableReview,
  enableReviewButton,
  setEnableReviewButton,
  selectedUsers,
  setSelectedUsers,
  users,
  selectedLanguage,
}: UseLanguageReviewOutput & {
  users: ReviewUser[];
  selectedLanguage: Language;
}) {
  const handleStartReviewClick = () => {
    const userDBProfile = getDataBaseUserProfile();
    const userLoginProfile = getUserProfile();

    axios
      .post(
        Service(ExternalServices.LanguageReviewDomain).getAll(
          ExternalServices.LanguageReviewsContext
        ),
        {
          languageId: selectedLanguage.id,
          status: "review",
          languageOwner: userDBProfile.user.id,
          languageOwnerEmail: userLoginProfile.email,
        }
      )
      .then(({ data }) => {
        const review: Review = data;
        const owner = getOwner({ users, languageReview: review });
        setReview(review);
        setOwner(owner);
        setSelectedUsers([]);
        setEnableReview(true);
        setEnableReviewButton(false);
      });
  };

  const handleAutocompleteClick = (user: ReviewUser) => {
    const serviceUrl = Service(ExternalServices.LanguageReviewDomain).post(
      ExternalServices.ReviewersResource
    );

    axios
      .post(serviceUrl, {
        email: user.email,
        languageReview: review.id,
      })
      .then(() => {
        setSelectedUsers([...selectedUsers, user]);
      });
  };

  if (!selectedLanguage) {
    return null;
  }

  return (
    <>
      {enableReviewButton && (
        <Button
          className="mb-3 mt-3"
          variant="primary"
          onClick={handleStartReviewClick}
        >
          Start a new review
        </Button>
      )}
      {enableReview && (
        <>
          <AutocompleteUserSearch
            users={users}
            onClick={handleAutocompleteClick}
          />
          {!!selectedUsers.length && (
            <>
              <div className="mt-3">
                <span>Reviewers:</span>
              </div>
              <ListGroup className="mt-2">
                {selectedUsers.map((user, index) => (
                  <ListGroup.Item action key={index}>
                    <People style={{ marginRight: "10px" }} />
                    <span>{user.name}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </>
      )}
      {owner && (
        <>
          <p className="mt-3">Owner:</p>
          <ListGroup className="mt-2">
            <ListGroup.Item action>
              <PersonGear style={{ marginRight: "10px" }} />
              <span>{owner.name}</span>
            </ListGroup.Item>
          </ListGroup>
        </>
      )}
    </>
  );
}
