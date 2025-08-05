/**
 * MyST Plugin for JupyterHub launch button
 */

const plugin = {
  name: "jupyterhub-button",
  author: "EOPF Sample Service",
  license: "Apache-2.0",

  directives: [
    {
      name: "jupyterhub-button",
      alias: ["launch-button"],
      doc: "Create a JupyterHub launch button",
      arg: { type: String, required: false },
      options: {
        notebook: { type: String },
        style: { type: String, default: "large" },
        color: { type: String, default: "#00c6fd" },
        image: { type: String, default: "default-notebooks-image" },
        profile: { type: String, default: "choose-your-environment" },
      },
      run(data, vfile) {
        // Get notebook path from option or current file
        let notebookPath = data.options?.notebook || "";

        if (!notebookPath && vfile && vfile.path) {
          const fullPath = vfile.path;

          // Find the last occurrence of 'notebooks/' and take everything after it
          const lastNotebooksIndex = fullPath.lastIndexOf("notebooks/");
          if (lastNotebooksIndex !== -1) {
            notebookPath = fullPath.substring(
              lastNotebooksIndex + "notebooks/".length,
            );
          } else {
            // Fallback: just get the filename and immediate parent directory
            const pathParts = fullPath.split("/");
            if (pathParts.length >= 2) {
              notebookPath = pathParts.slice(-2).join("/");
            } else {
              notebookPath = pathParts[pathParts.length - 1];
            }
          }
        }

        if (!notebookPath) {
          return [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "Error: Could not determine notebook path",
                },
              ],
            },
          ];
        }

        // Create fancy forms configuration
        const fancyFormsConfig = {
          profile: data.options?.profile || "choose-your-environment",
          image: data.options?.image || "default-notebooks-image",
          "image:unlisted_choice": "",
          default_url: "unlisted_choice",
          "default_url:unlisted_choice": `/lab/tree/notebooks/${notebookPath}`,
          autoStart: "true",
        };

        // Create JupyterHub URL with fancy forms
        const baseUrl = "https://jupyterhub.user.eopf.eodc.eu/hub/login?next=/hub/spawn%23fancy-forms-config%3D";
        const configString = JSON.stringify(fancyFormsConfig);
        const jupyterHubUrl = `${baseUrl}${encodeURIComponent(configString)}`;

        // Get style options
        const isLarge = data.options?.style === "large";

        // Create a centered container using classes
        return [
          {
            type: "div",
            data: {
              hName: "div",
              hProperties: {
                className: [
                  `jupyterhub-button-container`,
                  isLarge ? "large" : "small",
                ],
              },
            },
            children: [
              {
                type: "paragraph",
                data: {
                  hName: "p",
                  hProperties: {
                    className: ["jupyterhub-button-wrapper"],
                  },
                },
                children: [
                  {
                    type: "link",
                    url: jupyterHubUrl,
                    data: {
                      hName: "a",
                      hProperties: {
                        target: "_blank",
                        className: ["jupyterhub-launch-button"],
                      },
                    },
                    children: [
                      { type: "text", value: "🚀 Launch in JupyterHub" },
                    ],
                  },
                ],
              },
              {
                type: "paragraph",
                data: {
                  hName: "p",
                  hProperties: {
                    className: ["jupyterhub-button-description"],
                  },
                },
                children: [
                  {
                    type: "emphasis",
                    children: [
                      {
                        type: "text",
                        value:
                          "Run this notebook interactively with all dependencies pre-installed",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];
      },
    },
  ],
};

export default plugin;
