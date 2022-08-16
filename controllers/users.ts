import { config } from "https://deno.land/x/dotenv/mod.ts";
const { DATA_API_KEY, APP_ID } = config();
const BASE_URI = `https://data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1/action`;
const DATA_SOURCE = "Wordle";
const DATABASE = "wordle_db";
const COLLECTION = "users";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": DATA_API_KEY,
  },
  body: "",
};

// @description: ADD single user
// @route POST /api/users
const addUser = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = await request.body();
      const user = await body.value;
      const URI = `${BASE_URI}/insertOne`;
      const query = {
        collection: COLLECTION,
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: user,
      };
      options.body = JSON.stringify(query);
      const dataResponse = await fetch(URI, options);
      const { insertedId } = await dataResponse.json();

      response.status = 201;
      response.body = {
        success: true,
        data: user,
        insertedId,
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// @description: GET all users
// @route GET /api/users
const getUsers = async ({ response }: { response: any }) => {
  try {
    const URI = `${BASE_URI}/find`;
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const allUsers = await dataResponse.json();

    if (allUsers) {
      response.status = 200;
      response.body = {
        success: true,
        data: allUsers,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Internal Server Error",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// @description: GET single user
// @route GET /api/users/:id
const getUser = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  const URI = `${BASE_URI}/findOne`;
  const query = {
    collection: COLLECTION,
    database: DATABASE,
    dataSource: DATA_SOURCE,
    filter: { id: parseInt(params.id) },
  };
  options.body = JSON.stringify(query);
  const dataResponse = await fetch(URI, options);
  const user = await dataResponse.json();

  if (user) {
    response.status = 200;
    response.body = {
      success: true,
      data: user,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No user found",
    };
  }
};

// @description: UPDATE single user
// @route PUT /api/users/:id
const updateUser = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body();
    const { name } = await body.value;
    const URI = `${BASE_URI}/updateOne`;
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: { id: parseInt(params.id) },
      update: { $set: { name } },
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const userUpdated = await dataResponse.json();

    response.status = 200;
    response.body = {
      success: true,
      userUpdated,
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// @description: DELETE single user
// @route DELETE /api/users/:id
const deleteUser = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  try {
    const URI = `${BASE_URI}/deleteOne`;
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: { id: parseInt(params.id) },
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const userDeleted = await dataResponse.json();

    response.status = 201;
    response.body = {
      userDeleted,
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

export { addUser, getUsers, getUser, updateUser, deleteUser };
