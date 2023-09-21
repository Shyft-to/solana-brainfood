import type { Meta, StoryObj } from "@storybook/react"
import { PlusIcon } from "lucide-react"
import { Button, ButtonProps } from "./button"

const meta: Meta<ButtonProps> = {
  title: "components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    size: "md",
    variant: "solid",
    fullWidth: false,
    disabled: false,
    children: "Submit",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["solid", "outline", "link"],
    },
  },
}

type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: (props) => <Button {...props} />,
}

export const Variants: Story = {
  render: ({ children, ...rest }) => (
    <div className="flex gap-4">
      <Button {...rest} variant="solid">
        {children}
      </Button>
      <Button {...rest} variant="outline">
        {children}
      </Button>
      <Button {...rest} variant="link">
        {children}
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: ({ children, ...rest }) => (
    <div className="flex gap-4">
      <Button {...rest} size="sm">
        {children}
      </Button>
      <Button {...rest} size="md">
        {children}
      </Button>
      <Button {...rest} size="lg">
        {children}
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: ({ children, ...rest }) => (
    <div className="flex gap-4">
      <Button {...rest} variant="solid" startDecorator={<PlusIcon />}>
        {children}
      </Button>
      <Button {...rest} variant="outline" startDecorator={<PlusIcon />}>
        {children}
      </Button>
      <Button {...rest} variant="link" startDecorator={<PlusIcon />}>
        {children}
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: ({ children, ...rest }) => (
    <div className="flex gap-4">
      <Button {...rest} variant="solid" loading>
        {children}
      </Button>
      <Button {...rest} variant="outline" loading>
        {children}
      </Button>
      <Button {...rest} variant="link" loading>
        {children}
      </Button>
    </div>
  ),
}

export default meta
