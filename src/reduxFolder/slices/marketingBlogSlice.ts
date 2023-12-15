//libs
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IBlock, IPost, IStrFile } from "types/marketing";

// assets
import image from "assets/images/default-event.png";
import moment from "moment";
import { useHttp } from "hooks/useHttp";
import { API, instance, serverDomain } from "services/API";
import Block from "components/Marketing/Calendar/Block/Block";

type InitialState = {
  blocks: IBlock[];
  fetchedPost: FetchPost | undefined;
  fetchedBlocks: IBlock[];
  posts: IPost[];
  postsLoadingStatus: string;
  postsBlockStatus: string;
};

const initialState = {
  blocks: [],
  fetchedPost: undefined,
  fetchedBlocks: [],
  posts: [
    {
      id: 1,
      title: "",
      short_description: "",
      category: "Unkategorisiert",
      primary_image: undefined,
      date_posted: "",
      meta_title: "",
      meta_description: "",
      comment_count: 0,
    },
  ],
  postsLoadingStatus: "idle",
  postsBlockStatus: "idle",
} as InitialState;

type FetchedPosts = {
  count: number;
  next: string;
  previous: string;
  results: IPost[];
};

type FetchedBlocks = {
  count: number;
  next: string;
  previous: string;
  results: IBlock[];
};

export type FetchBlock = {
  id: number;
  block_type: string;
  block_title: string;
  content: string;
  image: File | undefined;
  image_type: "horizontal" | "vertical";
  post: number;
};

export type FetchPost = {
  id: number;
  title: string;
  short_description: string;
  category: "Unkategorisiert" | "Umzüge";
  primary_image: File;
  date_posted: string;
  comment_count: number;
  comments: [];
  blocks: FetchBlock[];
  meta_title: string;
  meta_description: string;
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next ? next.replace(/^htttp:/, "https:") : `${serverDomain}api/v1/posts/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const fetchBlocks = createAsyncThunk(
  "posts/fetchPostBlocks",
  (next: string | undefined) => {
    const { request } = useHttp();
    return request(
      next
        ? next.replace(/^htttp:/, "https:")
        : `${serverDomain}api/v1/post-blocks/`,
      "GET",
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      }
    );
  }
);

export const addPost = createAsyncThunk("post/addPost", async (data: IPost) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "multipart/form-data",
    };

    const response = await instance.post("api/v1/posts/", data, {
      headers,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
});

export const addPostBlock = createAsyncThunk(
  "posts/addPostBlock",
  async (data: FetchBlock) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await instance.post("api/v1/post-blocks/", data, {
        headers,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

export const deletePostBlock = createAsyncThunk(
  "posts/deletePostBlock",
  async (blockId: number) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      };

      const response = await instance.delete(`api/v1/post-blocks/${blockId}`, {
        headers,
      });

      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (id: string) => {
    try {
      const data = await API.getPostById(id);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async (props: { id: string; data: Partial<FetchPost> }) => {
    if (!(props.data.primary_image instanceof File)) {
      props.data.primary_image = undefined;
    }
    try {
      const response = await API.editPost(props.id, props.data);
      return { id: props.id, data: response };
    } catch (error) {
      console.log(error);
    }
  }
);

export const editPostBlock = createAsyncThunk(
  "posts/editPostBlock",
  async (props: { id: string; data: Partial<FetchBlock> }) => {
    try {
      const response = await API.editPostBlock(props.id, props.data);
      return { id: props.id, data: response };
    } catch (error) {
      console.log(error);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: number) => {
    try {
      await API.deletePost(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const marketingSlice = createSlice({
  name: "marketing",
  initialState,
  reducers: {
    addBlock: (state, action: PayloadAction<IBlock>) => {
      state.blocks.push(action.payload);
    },
    setBlockTitle: (
      state,
      action: PayloadAction<{ title: string; blockId: number }>
    ) => {
      let targetBlock;
      if (state.fetchedBlocks.length < state.blocks.length) {
        targetBlock = state.blocks.find(
          (block) => block.id === action.payload.blockId
        );
      } else {
        targetBlock = state.fetchedBlocks.find(
          (block) => block.id === action.payload.blockId
        );
      }

      if (targetBlock) {
        targetBlock.block_title = action.payload.title;
      }
    },
    setBlockDescription: (
      state,
      action: PayloadAction<{ description: string; blockId: number }>
    ) => {
      let targetBlock;
      if (state.fetchedBlocks.length < state.blocks.length) {
        targetBlock = state.blocks.find(
          (block) => block.id === action.payload.blockId
        );
      } else {
        targetBlock = state.fetchedBlocks.find(
          (block) => block.id === action.payload.blockId
        );
      }
      if (targetBlock) {
        targetBlock.content = action.payload.description;
      }
    },
    setBlockImage: (
      state,
      action: PayloadAction<{
        imageInfo: IStrFile | undefined;
        blockId: number;
      }>
    ) => {
      let targetBlock;
      if (state.fetchedBlocks.length < state.blocks.length) {
        targetBlock = state.blocks.find(
          (block) => block.id === action.payload.blockId
        );
      } else {
        targetBlock = state.fetchedBlocks.find(
          (block) => block.id === action.payload.blockId
        );
      }
      if (targetBlock) {
        targetBlock.image = action.payload.imageInfo;
      }
    },
    setBlockImageType: (
      state,
      action: PayloadAction<{
        imageType: "horizontal" | "vertical";
        blockId: number;
      }>
    ) => {
      let targetBlock;
      if (state.fetchedBlocks.length < state.blocks.length) {
        targetBlock = state.blocks.find(
          (block) => block.id === action.payload.blockId
        );
      } else {
        targetBlock = state.fetchedBlocks.find(
          (block) => block.id === action.payload.blockId
        );
      }

      if (targetBlock) {
        targetBlock.image_type = action.payload.imageType;
      }
    },
    clearBlocks: (state) => {
      state.blocks = [];
    },
    clearFetchedPost: (state) => {
      state.fetchedPost = undefined;
    },
    clearFetchedBlocks: (state) => {
      state.fetchedBlocks = [];
    },
    deleteBlock: (state, action: PayloadAction<number>) => {
      state.blocks = state.blocks.filter((block) => block.id != action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.postsLoadingStatus = "loading";
      })
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<FetchedPosts>) => {
          state.posts = action.payload.results;
          state.postsLoadingStatus = "idle";
        }
      )
      .addCase(fetchPosts.rejected, (state) => {
        state.postsBlockStatus = "error";
      })
      .addCase(fetchBlocks.pending, (state) => {
        state.postsBlockStatus = "loading";
      })
      .addCase(
        fetchBlocks.fulfilled,
        (state, action: PayloadAction<FetchedBlocks>) => {
          state.blocks = action.payload.results;
          state.postsBlockStatus = "idle";
        }
      )
      .addCase(fetchBlocks.rejected, (state) => {
        state.postsBlockStatus = "error";
      })
      .addCase(getPostById.pending, (state) => {
        state.postsBlockStatus = "loading";
      })
      .addCase(
        getPostById.fulfilled,
        (state, action: PayloadAction<FetchPost>) => {
          state.fetchedBlocks = action.payload.blocks.map((block) => ({
            id: block.id,
            block_type: block.block_type,
            block_title: block.block_title,
            content: block.content,
            image: block.image,
            image_type: block.image_type,
            post: block.post,
          }));
          state.fetchedPost = action.payload;
          state.blocks = state.fetchedBlocks;
          state.postsBlockStatus = "idle";
        }
      );
  },
});

const { reducer } = marketingSlice;
export const {
  addBlock,
  setBlockTitle,
  setBlockDescription,
  setBlockImage,
  clearBlocks,
  clearFetchedPost,
  clearFetchedBlocks,
  setBlockImageType,
  deleteBlock,
} = marketingSlice.actions;
export default reducer;
