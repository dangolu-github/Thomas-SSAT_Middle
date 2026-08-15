# Version-pin student and teacher Apps Script surfaces

Use one Thomas-only Apps Script project with two immutable deployments sharing project storage: an anonymous learner assignment service whose version contains no teacher route, and an owner-only Teacher Portal whose version exposes matched artifacts and controls. This preserves one assignment record while preventing the public deployment from reaching teacher content; changing the project head never changes either live surface until that exact deployment is deliberately updated.
